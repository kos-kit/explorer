import { QueryEngine } from "@comunica/query-sparql";
import { QueryStringContext } from "@comunica/types";
import { Concept } from "@/lib/models/Concept";
import { ConceptScheme } from "@/lib/models//ConceptScheme";
import { Identifier } from "@/lib/models//Identifier";
import { SparqlConcept } from "@/lib/models/sparql/SparqlConcept";
import { rdf, rdfs, skos } from "@/lib/vocabularies";
import invariant from "ts-invariant";
import { SparqlConceptScheme } from "@/lib/models/sparql/SparqlConceptScheme";
import { AbstractModelSet } from "@/lib/models/AbstractModelSet";

export class SparqlModelSet extends AbstractModelSet {
  constructor(
    private readonly queryContext: QueryStringContext,
    private readonly queryEngine: QueryEngine,
  ) {
    super();
  }

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

  async conceptsPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    const concepts: Concept[] = [];

    const query = `
SELECT ?concept
WHERE {
  ?concept <${rdf.type.value}>/<${rdfs.subClassOf.value}>* <${skos.Concept.value}> .
}
LIMIT ${limit}
OFFSET ${offset}
`;

    for await (const bindings of await this.queryEngine.queryBindings(
      query,
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
    const query = `
SELECT (COUNT(?concept) AS ?count)
WHERE {
  ?concept <${rdf.type.value}>/<${rdfs.subClassOf.value}>* <${skos.Concept.value}> .
}
    `;

    for await (const bindings of await this.queryEngine.queryBindings(
      query,
      this.queryContext,
    )) {
      const count = bindings.get("count");
      invariant(count && count.termType === "Literal");
      return parseInt(count.value);
    }
    throw new Error("should never get here");
  }

  conceptSchemeByIdentifier(identifier: Identifier): Promise<ConceptScheme> {
    return new Promise((resolve) =>
      resolve(
        new SparqlConceptScheme({
          identifier,
          queryContext: this.queryContext,
          queryEngine: this.queryEngine,
        }),
      ),
    );
  }

  async conceptSchemes(): Promise<readonly ConceptScheme[]> {
    const conceptSchemes: ConceptScheme[] = [];

    const query = `
SELECT ?conceptScheme
WHERE {
  ?conceptScheme <${rdf.type.value}>/<${rdfs.subClassOf.value}>* <${skos.ConceptScheme.value}> .
}
`;

    for await (const bindings of await this.queryEngine.queryBindings(
      query,
      this.queryContext,
    )) {
      const conceptSchemeIdentifier = bindings.get("conceptScheme");
      invariant(
        conceptSchemeIdentifier &&
          (conceptSchemeIdentifier.termType === "BlankNode" ||
            conceptSchemeIdentifier.termType === "NamedNode"),
      );
      conceptSchemes.push(
        new SparqlConceptScheme({
          identifier: conceptSchemeIdentifier,
          queryContext: this.queryContext,
          queryEngine: this.queryEngine,
        }),
      );
    }

    return conceptSchemes;
  }
}
