import { QueryEngine } from "@comunica/query-sparql";
import { QueryStringContext } from "@comunica/types";
import { Identifier } from "@/lib/models/Identifier";
import { RdfJsModel } from "../rdfjs/RdfJsModel";
import { DatasetCore, Literal, NamedNode } from "@rdfjs/types";
import { Store } from "n3";
import { Model } from "@/lib/models/Model";

/**
 * Abstract base class for SPARQL-backed models.
 *
 * Most methods are delegated to an RDF/JS-backed model after populating it with a SPARQL construct query.
 */
export abstract class SparqlModel<RdfJsModelT extends RdfJsModel>
  implements Model
{
  readonly identifier: Identifier;
  protected readonly queryContext: QueryStringContext;
  protected readonly queryEngine: QueryEngine;
  private _rdfJsModel: RdfJsModelT | null = null;

  constructor({
    identifier,
    queryContext,
    queryEngine,
  }: {
    identifier: Identifier;
    queryContext: QueryStringContext;
    queryEngine: QueryEngine;
  }) {
    this.identifier = identifier;
    this.queryContext = queryContext;
    this.queryEngine = queryEngine;
  }

  protected abstract createRdfJsModel(dataset: DatasetCore): RdfJsModelT;

  protected async getOrCreateRdfJsModel(): Promise<RdfJsModelT> {
    if (this._rdfJsModel !== null) {
      return this._rdfJsModel;
    }

    const store = new Store();
    for await (const quad of await this.queryEngine.queryQuads(
      this.rdfJsDatasetQueryString,
      this.queryContext,
    )) {
      store.addQuad(quad);
    }
    this._rdfJsModel = this.createRdfJsModel(store);
    return this._rdfJsModel;
  }

  async license(
    languageTag: string,
  ): Promise<Literal | NamedNode<string> | null> {
    return (await this.getOrCreateRdfJsModel()).license(languageTag);
  }

  async modified(): Promise<Literal | null> {
    return (await this.getOrCreateRdfJsModel()).modified();
  }

  protected get rdfJsDatasetQueryString(): string {
    return `
CONSTRUCT WHERE {
  <${this.identifier.value}> ?p ?o .
}
`;
  }

  async rights(languageTag: string): Promise<Literal | null> {
    return (await this.getOrCreateRdfJsModel()).rights(languageTag);
  }

  async rightsHolder(languageTag: string): Promise<Literal | null> {
    return (await this.getOrCreateRdfJsModel()).rightsHolder(languageTag);
  }
}
