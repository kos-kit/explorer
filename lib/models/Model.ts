import { Literal, NamedNode } from "@rdfjs/types";
import { LanguageTag } from "./LanguageTag";

export interface Model {
  license(languageTag: LanguageTag): Promise<Literal | NamedNode | null>;
  modified(): Promise<Literal | null>;
  rights(languageTag: LanguageTag): Promise<Literal | null>;
  rightsHolder(languageTag: LanguageTag): Promise<Literal | null>;
}
