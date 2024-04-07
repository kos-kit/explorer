import { QueryEngine } from "@comunica/query-sparql-rdfjs";
import { testDataset } from "../../testDataset";
import { SparqlModelSet } from "@/lib/models/sparql/SparqlModelSet";

export const testSparqlModelSet = new SparqlModelSet(
  {
    sources: [testDataset],
  },
  new QueryEngine(),
);
