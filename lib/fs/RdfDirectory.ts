import fs from "node:fs/promises";
import path from "node:path";
import promiseSpawn from "@npmcli/promise-spawn";
import { DataFactory, DatasetCore, DatasetCoreFactory } from "@rdfjs/types";
import { RdfFile } from "./RdfFile.js";
import * as fsEither from "./fsEither.js";
import { getRdfFileFormat } from "./getRdfFileFormat.js";

type Logger = {
  debug(...parameters: any[]): void;
  info(...parameters: any[]): void;
  warn(...parameters: any[]): void;
};

/**
 * Abstraction for iterating over a directory of files with RDF data in them.
 */
export class RdfDirectory {
  readonly path: string;
  private readonly logger: Logger;

  constructor({ logger, path }: { logger: Logger; path: string }) {
    this.logger = logger;
    this.path = path;
  }

  async *files(): AsyncGenerator<RdfFile> {
    const logger = this.logger;

    async function* visitDirectory(
      directoryPath: string,
    ): AsyncGenerator<RdfFile> {
      for (const dirent of await fs.readdir(directoryPath, {
        withFileTypes: true,
      })) {
        if (dirent.name.startsWith(".")) {
          continue;
        }
        let direntPath = path.resolve(directoryPath, dirent.name);
        let direntIsDirectory: boolean;
        let direntIsFile: boolean;
        if (dirent.isSymbolicLink()) {
          direntPath = await fs.realpath(direntPath);
          const stat = await fs.stat(direntPath);
          direntIsDirectory = stat.isDirectory();
          direntIsFile = stat.isFile();
        } else {
          direntIsDirectory = dirent.isDirectory();
          direntIsFile = dirent.isFile();
        }
        if (direntIsDirectory) {
          yield* visitDirectory(direntPath);
        } else if (direntIsFile) {
          yield* visitFile(direntPath);
        } else {
          logger.warn("%s is not a directory or file", direntPath);
        }
      }
    }

    async function* visitFile(filePath: string): AsyncGenerator<RdfFile> {
      const rdfFileFormat = getRdfFileFormat(filePath);
      if (rdfFileFormat.isRight()) {
        yield new RdfFile({
          format: rdfFileFormat.unsafeCoerce(),
          logger,
          path: filePath,
        });
      }
    }

    const statEither = await fsEither.stat(this.path);
    if (statEither.isLeft()) {
      this.logger.debug(
        "%s does not exist or is not accessible: %s",
        this.path,
        (statEither.extract() as Error).message,
      );
      return;
    }
    let stat = statEither.unsafeCoerce();
    let thisPath = this.path;
    if (stat.isSymbolicLink()) {
      thisPath = await fs.realpath(this.path);
      stat = await fs.stat(thisPath);
    }

    if (stat.isDirectory()) {
      yield* visitDirectory(thisPath);
    } else {
      this.logger.warn("%s is not an (RDF) directory", this.path);
    }
  }

  async gitClean(): Promise<void> {
    this.logger.info("running git clean on %s", this.path);
    await promiseSpawn("git", ["clean", "-d", "-f"]);
    this.logger.info("ran git clean on %s", this.path);
  }

  async *parse({
    dataFactory,
    datasetCoreFactory,
  }: {
    dataFactory: DataFactory;
    datasetCoreFactory: DatasetCoreFactory;
  }): AsyncGenerator<DatasetCore> {
    for await (const file of this.files()) {
      yield file.parse({ dataFactory, dataset: datasetCoreFactory.dataset() });
    }
  }
}
