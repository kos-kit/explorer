import * as path from "node:path";
import { Mime } from "mime";
import otherMimeTypes from "mime/types/other.js";
import standardMimeTypes from "mime/types/standard.js";
import { Either, Just, Left, Nothing, Right } from "purify-ts";
import { rdfFormats } from "../RdfFormat.js";
import { compressionMethods } from "./CompressionMethod.js";
import { RdfFileFormat } from "./RdfFileFormat.js";

const mime = new Mime(standardMimeTypes, otherMimeTypes, {
  "application/x-brotli": ["br"],
});

export function getRdfFileFormat(
  filePath: string,
): Either<Error, RdfFileFormat> {
  const mimeType = mime.getType(filePath);
  if (mimeType === null) {
    return Left(new Error(`unable to infer MIME type of ${filePath}`));
  }

  for (const compressionMethod of compressionMethods) {
    if (compressionMethod === mimeType) {
      const uncompressedFileName = path.basename(
        path.basename(filePath),
        path.extname(filePath),
      );
      const uncompressedMimeType = mime.getType(uncompressedFileName);
      if (uncompressedMimeType === null) {
        return Left(
          new Error(`unable to infer MIME type of ${uncompressedFileName}`),
        );
      }
      for (const rdfFormat of rdfFormats) {
        if (uncompressedMimeType === rdfFormat) {
          return Right({
            compressionMethod: Just(compressionMethod),
            rdfFormat,
          });
        }
      }
    }
  }

  for (const rdfFormat of rdfFormats) {
    if (mimeType === rdfFormat) {
      return Right({
        compressionMethod: Nothing,
        rdfFormat,
      });
    }
  }

  return Left(new Error(`${filePath} has a non-RDF MIME type: ${mimeType}`));
}
