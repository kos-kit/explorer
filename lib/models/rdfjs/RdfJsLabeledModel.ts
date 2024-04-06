import { NamedNode } from "@rdfjs/types";
import { Label } from "@/lib/models/Label";
import { LabeledModel } from "@/lib/models/LabeledModel";
import { RdfJsModel } from "@/lib/models/rdfjs/RdfJsModel";
import { RdfJsLabel } from "@/lib/models/rdfjs/RdfJsLabel";
import { skos, skosxl } from "@/lib/vocabularies";
import { mapTermToIdentifier } from "./mapTermToIdentifier";
import { LanguageTag } from "../LanguageTag";
import { LiteralLabel } from "../LiteralLabel";

export abstract class RdfJsLabeledModel
  extends RdfJsModel
  implements LabeledModel
{
  altLabels(): Promise<readonly Label[]> {
    return new Promise((resolve) =>
      resolve([...this.labels(skos.altLabel, skosxl.altLabel)]),
    );
  }

  hiddenLabels(): Promise<readonly Label[]> {
    return new Promise((resolve) =>
      resolve([...this.labels(skos.hiddenLabel, skosxl.hiddenLabel)]),
    );
  }

  async prefLabel(languageTag: LanguageTag): Promise<Label | null> {
    for (const prefLabel of await this.prefLabels()) {
      if (prefLabel.literalForm.language === languageTag) {
        return prefLabel;
      }
    }
    return null;
  }

  private *labels(
    skosPredicate: NamedNode,
    skosXlPredicate: NamedNode,
  ): Iterable<Label> {
    yield* this.filterAndMapObjects(skosPredicate, (term) =>
      term.termType === "Literal" ? new LiteralLabel(term) : null,
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
        if (literalFormQuad.object.termType === "Literal") {
          return new RdfJsLabel({
            dataset: this.dataset,
            identifier: labelIdentifier,
            literalForm: literalFormQuad.object,
          });
        }
      }

      return null;
    });
  }

  prefLabels(): Promise<readonly Label[]> {
    return new Promise((resolve) =>
      resolve([...this.labels(skos.prefLabel, skosxl.prefLabel)]),
    );
  }
}
