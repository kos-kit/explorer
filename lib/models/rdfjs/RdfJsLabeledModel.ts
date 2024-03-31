import { NamedNode } from "@rdfjs/types";
import { Label } from "../Label";
import { LabeledModel } from "../LabeledModel";
import { RdfJsResource } from "./RdfJsResource";
import { skos, skosxl } from "@tpluscode/rdf-ns-builders";
import { RdfJsLabel } from "./RdfJsLabel";

export abstract class RdfJsLabeledModel
  extends RdfJsResource
  implements LabeledModel
{
  *altLabels(): Iterable<Label> {
    yield* this.labels(skos.altLabel, skosxl.altLabel);
  }

  *hiddenLabels(): Iterable<Label> {
    yield* this.labels(skos.hiddenLabel, skosxl.hiddenLabel);
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
      switch (term.termType) {
        case "BlankNode":
        case "NamedNode":
          break;
        default:
          return null;
      }

      for (const literalFormQuad of this.dataset.match(
        term,
        skosxl.literalForm,
        null,
        null,
      )) {
        if (literalFormQuad.object.termType === "Literal") {
          return new RdfJsLabel(this.dataset, term, literalFormQuad.object);
        }
      }

      return null;
    });
  }

  *prefLabels(): Iterable<Label> {
    yield* this.labels(skos.prefLabel, skosxl.prefLabel);
  }
}
