import { Identifier } from "../models/Identifier";

export function identifierToString(identifier: Identifier) {
  switch (identifier.termType) {
    case "BlankNode":
      return `_:${identifier.value}`;
    case "NamedNode":
      return `<${identifier.value}>`;
  }
}
