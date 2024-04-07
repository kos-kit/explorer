import { Literal, NamedNode } from "@rdfjs/types";
import { Label } from "@/lib/models/Label";
import { LanguageTag } from "./LanguageTag";

/**
 * A Label that only consists of its literal form.
 */
export class LiteralLabel implements Label {
  constructor(readonly literalForm: Literal) {}

  license(
    _languageTag: LanguageTag,
  ): Promise<Literal | NamedNode<string> | null> {
    return Promise.resolve(null);
  }

  modified(): Promise<Literal | null> {
    return Promise.resolve(null);
  }

  rights(_languageTag: LanguageTag): Promise<Literal | null> {
    return Promise.resolve(null);
  }

  rightsHolder(_languageTag: LanguageTag): Promise<Literal | null> {
    return Promise.resolve(null);
  }
}
