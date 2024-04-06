import { QueryEngine } from "@comunica/query-sparql";
import { ModelSet } from "@/lib/models/ModelSet";
import { QueryStringContext } from "@rdfjs/types";
import { Concept } from "../Concept";
import { ConceptScheme } from "../ConceptScheme";
import { Identifier } from "../Identifier";

export class SparqlModelSet implements ModelSet {
  constructor(
    private readonly queryContext: QueryStringContext,
    private readonly queryEngine: QueryEngine,
  ) {}

  conceptByIdentifier(identifier: Identifier): Concept {
    throw new Error("Method not implemented.");
  }

  concepts(kwds: { limit: number; offset: number }): Iterable<Concept> {
    throw new Error("Method not implemented.");
  }

  conceptsCount: number;

  conceptSchemeByIdentifier(identifier: Identifier): ConceptScheme {
    throw new Error("Method not implemented.");
  }

  conceptSchemes: readonly ConceptScheme[];
  languageTags: readonly string[];
}
