import fs from "node:fs";
import { Readable } from "node:stream";
import zlib from "node:zlib";
import { DataFactory, DatasetCore } from "@rdfjs/types";
import bz2 from "unbzip2-stream";
import { RdfFileFormat } from "./RdfFileFormat.js";
import { parseJsonLdStream } from "./parseJsonLdStream.js";
import { parseN3Stream } from "./parseN3Stream.js";

export async function parseRdfFile({
  dataFactory,
  dataset,
  rdfFileFormat,
  rdfFilePath,
}: {
  dataFactory: DataFactory;
  dataset: DatasetCore;
  rdfFileFormat: RdfFileFormat;
  rdfFilePath: string;
}): Promise<DatasetCore> {
  let rdfFileStream: Readable = fs.createReadStream(rdfFilePath);

  if (rdfFileFormat.compressionMethod.isJust()) {
    switch (rdfFileFormat.compressionMethod.unsafeCoerce()) {
      case "application/gzip":
        rdfFileStream = rdfFileStream.pipe(zlib.createGunzip());
        break;
      case "application/x-brotli":
        rdfFileStream = rdfFileStream.pipe(zlib.createBrotliDecompress());
        break;
      case "application/x-bzip2":
        rdfFileStream = rdfFileStream.pipe(bz2());
        break;
    }
  }

  switch (rdfFileFormat.rdfFormat) {
    case "application/ld+json":
      await parseJsonLdStream({
        dataFactory,
        dataset,
        jsonLdStream: rdfFileStream,
      });
      break;
    case "application/n-quads":
    case "application/n-triples":
    case "application/trig":
    case "text/turtle":
      await parseN3Stream({
        dataFactory,
        dataset,
        n3Stream: rdfFileStream,
      });
      break;
    case "application/rdf+xml":
      throw new Error(`format not supported: ${rdfFileFormat.rdfFormat}`);
  }

  return dataset;
}
