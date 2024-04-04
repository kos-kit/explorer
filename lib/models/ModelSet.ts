import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { Identifier } from "./Identifier";
import { LanguageTag } from "./LanguageTag";

export interface ModelSet {
  conceptSchemeByIdentifier(identifier: Identifier): ConceptScheme;
  readonly conceptSchemes: readonly ConceptScheme[];

  /**
   * Return an iterable of language tags used by models in this ModelSet.
   */
  readonly languageTags: readonly LanguageTag[];
}
