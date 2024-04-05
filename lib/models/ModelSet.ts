import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { Identifier } from "@/lib/models/Identifier";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { Concept } from "@/lib/models/Concept";

export interface ModelSet {
  conceptByIdentifier(identifier: Identifier): Concept;
  concepts(kwds: { limit: number; offset: number }): Iterable<Concept>;
  readonly conceptsCount: number;

  conceptSchemeByIdentifier(identifier: Identifier): ConceptScheme;
  readonly conceptSchemes: readonly ConceptScheme[];

  readonly languageTags: readonly LanguageTag[];
}
