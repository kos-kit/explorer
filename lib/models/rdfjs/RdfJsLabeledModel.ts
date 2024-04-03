import { NamedNode } from "@rdfjs/types";
import { Label } from "@/lib/models/Label";
import { LabeledModel } from "@/lib/models/LabeledModel";
import { RdfJsResource } from "@/lib/models/rdfjs/RdfJsResource";
import { RdfJsLabel } from "@/lib/models/rdfjs/RdfJsLabel";
import { skos, skosxl } from "@/lib/vocabularies";
import { mapTermToIdentifier } from "./mapTermToIdentifier";
import { LanguageTag } from "../LanguageTag";

export abstract class RdfJsLabeledModel
  extends RdfJsResource
  implements LabeledModel
{
  get altLabels(): readonly Label[] {
    return [...this.labels(skos.altLabel, skosxl.altLabel)];
  }

  get hiddenLabels(): readonly Label[] {
    return [...this.labels(skos.hiddenLabel, skosxl.hiddenLabel)];
  }

  prefLabel(languageTag: LanguageTag): Label | null {
    for (const prefLabel of this.prefLabels) {
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
      term.termType === "Literal"
        ? ({
            literalForm: term,
          } satisfies Label)
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

  get prefLabels(): readonly Label[] {
    return [...this.labels(skos.prefLabel, skosxl.prefLabel)];
  }
}
