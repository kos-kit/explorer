import { Maybe } from "purify-ts";
import { RdfFormat } from "../RdfFormat.js";
import { CompressionMethod } from "./CompressionMethod.js";

export interface RdfFileFormat {
  compressionMethod: Maybe<CompressionMethod>;
  rdfFormat: RdfFormat;
}
