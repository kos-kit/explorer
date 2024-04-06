import { QueryEngine } from "@comunica/query-sparql";
import { QueryStringContext } from "@comunica/types";
import { ModelSet } from "@/lib/models/ModelSet";
import { Concept } from "../Concept";
import { ConceptScheme } from "../ConceptScheme";
import { Identifier } from "../Identifier";
import { SparqlConcept } from "./SparqlConcept";
import { rdf, rdfs, skos } from "@/lib/vocabularies";
import invariant from "ts-invariant";

export class SparqlModelSet implements ModelSet {
  constructor(
    private readonly queryContext: QueryStringContext,
    private readonly queryEngine: QueryEngine,
  ) {}

  conceptByIdentifier(identifier: Identifier): Promise<Concept> {
    return new Promise((resolve) =>
      resolve(
        new SparqlConcept({
          identifier,
          queryContext: this.queryContext,
          queryEngine: this.queryEngine,
        }),
      ),
    );
  }

  async concepts({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    const concepts: Concept[] = [];
    for await (const bindings of await this.queryEngine.queryBindings(
      `
SELECT ?concept
WHERE {
  ?concept (<${rdf.type.value}>/<${rdfs.subClassOf.value}>)* <${skos.Concept.value}> .
}
LIMIT ${limit}
OFFSET ${offset}
`,
      this.queryContext,
    )) {
      const conceptIdentifier = bindings.get("concept");
      invariant(
        conceptIdentifier &&
          (conceptIdentifier.termType === "BlankNode" ||
            conceptIdentifier.termType === "NamedNode"),
      );
      concepts.push(
        new SparqlConcept({
          identifier: conceptIdentifier,
          queryContext: this.queryContext,
          queryEngine: this.queryEngine,
        }),
      );
    }
    return concepts;
  }

  async conceptsCount(): Promise<number> {
    for await (const bindings of await this.queryEngine.queryBindings(
      `
SELECT COUNT(?concept) AS ?count
WHERE {
  ?concept (<${rdf.type.value}>/<${rdfs.subClassOf.value}>)* <${skos.Concept.value}> .
}
`,
      this.queryContext,
    )) {
      const count = bindings.get("count");
      invariant(count && count.termType === "Literal");
      return parseInt(count.value);
    }
    throw new Error("should never get here");
  }

  conceptSchemeByIdentifier(identifier: Identifier): Promise<ConceptScheme> {
    throw new Error("Method not implemented.");
  }

  conceptSchemes(): Promise<readonly ConceptScheme[]> {
    throw new Error("Method not implemented.");
  }

  languageTags(): Promise<readonly string[]> {
    return Promise.resolve(["en"]);
  }
}
