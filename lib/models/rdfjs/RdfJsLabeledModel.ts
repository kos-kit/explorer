import { NamedNode } from "@rdfjs/types";
import { Label } from "@/lib/models/Label";
import { LabeledModel } from "@/lib/models/LabeledModel";
import { RdfJsModel } from "@/lib/models/rdfjs/RdfJsModel";
import { RdfJsLabel } from "@/lib/models/rdfjs/RdfJsLabel";
import { skos, skosxl } from "@/lib/vocabularies";
import { mapTermToIdentifier } from "./mapTermToIdentifier";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { LiteralLabel } from "@/lib/models/LiteralLabel";

export abstract class RdfJsLabeledModel
  extends RdfJsModel
  implements LabeledModel
{
  altLabels(kwds?: { languageTag?: LanguageTag }): Promise<readonly Label[]> {
    return new Promise((resolve) =>
      resolve([
        ...this.labels({
          languageTag: kwds?.languageTag,
          skosPredicate: skos.altLabel,
          skosXlPredicate: skosxl.altLabel,
        }),
      ]),
    );
  }

  hiddenLabels(kwds?: {
    languageTag?: LanguageTag;
  }): Promise<readonly Label[]> {
    return new Promise((resolve) =>
      resolve([
        ...this.labels({
          languageTag: kwds?.languageTag,
          skosPredicate: skos.hiddenLabel,
          skosXlPredicate: skosxl.hiddenLabel,
        }),
      ]),
    );
  }

  private *labels({
    languageTag,
    skosPredicate,
    skosXlPredicate,
  }: {
    languageTag?: LanguageTag;
    skosPredicate: NamedNode;
    skosXlPredicate: NamedNode;
  }): Iterable<Label> {
    yield* this.filterAndMapObjects(skosPredicate, (term) =>
      term.termType === "Literal" &&
      (!languageTag || term.language === languageTag)
        ? new LiteralLabel(term)
        : null,
    );

    // Any resource in the range of a skosxl: label predicate is considered a skosxl:Label
    yield* this.filterAndMapObjects(skosXlPredicate, (term) => {
      const labelIdentifier = mapTermToIdentifier(term);
      if (labelIdentifier === null) {
        return null;
      }

      for (const literalFormQuad of this.dataset.match(
        term,
        skosxl.literalForm,
        null,
        null,
      )) {
        if (literalFormQuad.object.termType !== "Literal") {
          continue;
        }

        if (languageTag && literalFormQuad.object.language !== languageTag) {
          continue;
        }

        return new RdfJsLabel({
          dataset: this.dataset,
          identifier: labelIdentifier,
          literalForm: literalFormQuad.object,
        });
      }

      return null;
    });
  }

  prefLabels(kwds?: { languageTag?: LanguageTag }): Promise<readonly Label[]> {
    return new Promise((resolve) =>
      resolve([
        ...this.labels({
          languageTag: kwds?.languageTag,
          skosPredicate: skos.prefLabel,
          skosXlPredicate: skosxl.prefLabel,
        }),
      ]),
    );
  }
}
