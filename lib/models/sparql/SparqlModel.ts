import { QueryEngine } from "@comunica/query-sparql";
import { QueryStringContext } from "@comunica/types";
import { Identifier } from "@/lib/models/Identifier";

export abstract class SparqlModel {
  readonly identifier: Identifier;
  protected readonly queryContext: QueryStringContext;
  protected readonly queryEngine: QueryEngine;

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
}
