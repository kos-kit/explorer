import { Literal, NamedNode } from "@rdfjs/types";
import { LanguageTag } from "./LanguageTag";

export interface Model {
  license(languageTag: LanguageTag): Literal | NamedNode | null;
  readonly modified: Literal | null;
  rights(languageTag: LanguageTag): Literal | null;
  rightsHolder(languageTag: LanguageTag): Literal | null;
}
