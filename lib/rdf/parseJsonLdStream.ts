import { Readable } from "node:stream";
import { DataFactory, DatasetCore } from "@rdfjs/types";
import { JsonLdParser } from "jsonld-streaming-parser";

export async function parseJsonLdStream({
  dataFactory,
  dataset,
  jsonLdStream,
}: {
  dataFactory: DataFactory;
  dataset: DatasetCore;
  jsonLdStream: Readable;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const streamParser = new JsonLdParser({ dataFactory });
    streamParser.on("data", (quad) => {
      dataset.add(quad);
    });
    streamParser.on("error", reject);
    streamParser.on("end", () => {
      resolve();
    });
    streamParser.on("error", reject);
    jsonLdStream.pipe(streamParser);
  });
}
