import { DatasetCore } from "@rdfjs/types";
import { ModelSet } from "@/lib/models/ModelSet";
import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { RdfJsConceptScheme } from "@/lib/models/rdfjs/RdfJsConceptScheme";
import { rdf, skos } from "@/lib/vocabularies";
import { mapTermToIdentifier } from "./mapTermToIdentifier";
import { Identifier } from "../Identifier";
import { identifierToString } from "@/lib/utilities/identifierToString";

export class RdfJsModelSet implements ModelSet {
  constructor(private readonly dataset: DatasetCore) {}

  conceptSchemeByIdentifier(identifier: Identifier): ConceptScheme {
    for (const conceptScheme of this.conceptSchemes) {
      if (conceptScheme.identifier.equals(identifier)) {
        return conceptScheme;
      }
    }
    throw new RangeError(identifierToString(identifier));
  }

  get conceptSchemes(): readonly ConceptScheme[] {
    return [...this._conceptSchemes()];
  }

  private *_conceptSchemes(): Iterable<ConceptScheme> {
    for (const rdfTypeQuad of this.dataset.match(
      null,
      rdf.type,
      skos.ConceptScheme,
    )) {
      const identifier = mapTermToIdentifier(rdfTypeQuad.subject);
      if (identifier !== null) {
        yield new RdfJsConceptScheme({
          dataset: this.dataset,
          identifier,
        });
      }
    }
  }

  languageTags = ["en"];
}
