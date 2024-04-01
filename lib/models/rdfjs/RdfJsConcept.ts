import { Literal } from "@rdfjs/types";
import { Concept } from "../Concept";
import { RdfJsLabeledModel } from "./RdfJsLabeledModel";
import { skos } from "@/lib/vocabularies";

export class RdfJsConcept extends RdfJsLabeledModel implements Concept {
  *notations(): Iterable<Literal> {
    yield* this.filterAndMapObjects(skos.notation, (term) =>
      term.termType === "Literal" ? term : null,
    );
  }
}
