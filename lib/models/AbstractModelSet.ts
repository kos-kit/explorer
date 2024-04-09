import { ModelSet } from "@/lib/models/ModelSet";
import { Concept } from "./Concept";
import { ConceptScheme } from "./ConceptScheme";
import { Identifier } from "./Identifier";
import { LanguageTag } from "./LanguageTag";

export abstract class AbstractModelSet implements ModelSet {
  protected cachedLanguageTags: readonly LanguageTag[] | null = null;

  abstract conceptByIdentifier(identifier: Identifier): Promise<Concept>;

  async *concepts(): AsyncGenerator<Concept, any, unknown> {
    const conceptsCount = await this.conceptsCount();
    const limit = 100;
    let offset = 0;
    while (offset < conceptsCount) {
      for (const concept of await this.conceptsPage({ limit, offset })) {
        yield concept;
      }
      offset++;
    }
  }

  abstract conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]>;

  abstract conceptsCount(): Promise<number>;

  abstract conceptSchemeByIdentifier(
    identifier: Identifier,
  ): Promise<ConceptScheme>;

  abstract conceptSchemes(): Promise<readonly ConceptScheme[]>;

  async languageTags(): Promise<readonly string[]> {
    if (this.cachedLanguageTags !== null) {
      return this.cachedLanguageTags;
    }
  }
}
