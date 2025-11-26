import { DataFactory, DatasetCore } from "@rdfjs/types";
import { RdfFileFormat } from "./RdfFileFormat.js";
import { parseRdfFile } from "./parseRdfFile.js";

type Logger = {
  debug(...parameters: any[]): void;
};

export class RdfFile {
  readonly format: RdfFileFormat;
  readonly path: string;
  private readonly logger?: Logger;

  constructor({
    format,
    logger,
    path,
  }: {
    format: RdfFileFormat;
    logger?: Logger;
    path: string;
  }) {
    this.format = format;
    this.logger = logger;
    this.path = path;
  }

  async parse({
    dataFactory,
    dataset,
  }: {
    dataFactory: DataFactory;
    dataset: DatasetCore;
  }): Promise<DatasetCore> {
    this.logger?.debug("parsing RDF file %s", this.path);
    await parseRdfFile({
      dataFactory,
      dataset,
      rdfFileFormat: this.format,
      rdfFilePath: this.path,
    });
    this.logger?.debug(
      "parsed %d quads from RDF file %s",
      dataset.size,
      this.path,
    );
    return dataset;
  }
}
