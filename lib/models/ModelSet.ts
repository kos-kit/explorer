import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { Identifier } from "@/lib/models/Identifier";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { Concept } from "@/lib/models/Concept";

export interface ModelSet {
  conceptByIdentifier(identifier: Identifier): Promise<Concept>;
  concepts(): AsyncGenerator<Concept>;
  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]>;
  conceptsCount(): Promise<number>;

  conceptSchemeByIdentifier(identifier: Identifier): Promise<ConceptScheme>;
  conceptSchemes(): Promise<readonly ConceptScheme[]>;

  languageTags(): Promise<readonly LanguageTag[]>;
}
