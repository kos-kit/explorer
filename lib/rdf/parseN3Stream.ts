import { Readable } from "node:stream";
import { DataFactory, DatasetCore } from "@rdfjs/types";
import N3 from "n3";

export async function parseN3Stream({
  dataFactory,
  dataset,
  n3Stream,
}: {
  dataFactory: DataFactory;
  dataset: DatasetCore;
  n3Stream: Readable;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const streamParser = new N3.StreamParser({ factory: dataFactory });
    streamParser.on("data", (quad) => {
      dataset.add(quad);
    });
    streamParser.on("error", reject);
    streamParser.on("end", () => {
      resolve();
    });
    streamParser.on("error", reject);
    n3Stream.pipe(streamParser);
  });
}
