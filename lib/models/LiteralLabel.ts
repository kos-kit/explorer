import { Literal, NamedNode } from "@rdfjs/types";
import { Label } from "@/lib/models/Label";
import { LanguageTag } from "./LanguageTag";

/**
 * A Label that only consists of its literal form.
 */
export class LiteralLabel implements Label {
  constructor(readonly literalForm: Literal) {}

  license(_languageTag: LanguageTag): Literal | NamedNode<string> | null {
    return null;
  }

  modified: Literal | null = null;

  rights(_languageTag: LanguageTag): Literal | null {
    return null;
  }

  rightsHolder(_languageTag: LanguageTag): Literal | null {
    return null;
  }
}
