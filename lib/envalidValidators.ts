import fs from "node:fs";
import path from "node:path";
import * as envalid from "envalid";

export const existingPathValidator = envalid.makeExactValidator((value) => {
  if (value.length === 0) {
    throw new Error("not specified");
  }
  const resolvedPath = path.resolve(value);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`${resolvedPath} does not exist`);
  }
  return resolvedPath;
});

export const existingPathsValidator = envalid.makeExactValidator((value) => {
  if (value.length === 0) {
    return [];
  }
  return value.split(path.delimiter).flatMap((relativePath) => {
    if (relativePath.length === 0) {
      return [];
    }
    const resolvedPath = path.resolve(relativePath);
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`${resolvedPath} does not exist`);
    }
    return [resolvedPath];
  });
});

export const pathValidator = envalid.makeExactValidator((value) => {
  if (value.length === 0) {
    throw new Error("not specified");
  }
  return path.resolve(value);
});

export const intValidator = envalid.makeExactValidator<number>(Number.parseInt);

export const languageTagArrayValidator = envalid.makeExactValidator((value) => {
  if (value.length === 0) {
    return [];
  }
  return value.split(",").map((subValue) => subValue.trim());
});
