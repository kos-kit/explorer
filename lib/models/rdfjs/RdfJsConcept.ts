import { Literal } from "@rdfjs/types";
import { Concept } from "@/lib/models/Concept";
import { RdfJsLabeledModel } from "@/lib/models/rdfjs/RdfJsLabeledModel";
import { skos } from "@/lib/vocabularies";
import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { RdfJsConceptScheme } from "@/lib/models/rdfjs/RdfJsConceptScheme";
import { SemanticRelationProperty } from "../SemanticRelationProperty";

export class RdfJsConcept extends RdfJsLabeledModel implements Concept {
  get inSchemes(): readonly ConceptScheme[] {
    return [
      ...this.filterAndMapObjects(skos.inScheme, (term) =>
        term.termType === "BlankNode" || term.termType === "NamedNode"
          ? new RdfJsConceptScheme({ dataset: this.dataset, identifier: term })
          : null,
      ),
    ];
  }

  get notations(): readonly Literal[] {
    return [
      ...this.filterAndMapObjects(skos.notation, (term) =>
        term.termType === "Literal" ? term : null,
      ),
    ];
  }

  semanticRelations(property: SemanticRelationProperty): readonly Concept[] {
    return [
      ...this.filterAndMapObjects(property.identifier, (term) =>
        term.termType === "NamedNode"
          ? new RdfJsConcept({ dataset: this.dataset, identifier: term })
          : null,
      ),
    ];
  }

  semanticRelationsCount(property: SemanticRelationProperty): number {
    return this.countObjects(
      property.identifier,
      (term) => term.termType === "NamedNode",
    );
  }

  get topConceptOf(): readonly ConceptScheme[] {
    return [
      ...this.filterAndMapObjects(skos.topConceptOf, (term) =>
        term.termType === "BlankNode" || term.termType === "NamedNode"
          ? new RdfJsConceptScheme({ dataset: this.dataset, identifier: term })
          : null,
      ),
    ];
  }
}
