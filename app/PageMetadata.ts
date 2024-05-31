import { Metadata } from "next";
import kos from "./kos";
import { displayLabel } from "@/lib/utilities/displayLabel";
import {
  Concept,
  ConceptScheme,
  LanguageTag,
  SemanticRelationProperty,
} from "@kos-kit/client/models";

export class PageMetadata {
  private readonly _languageTag: LanguageTag;

  constructor({ languageTag }: { languageTag: LanguageTag }) {
    this._languageTag = languageTag;
  }

  async concept(concept: Concept): Promise<Metadata> {
    const rootPageMetadata = await this.languageTag();
    return {
      title: `${rootPageMetadata.title}: Concept: ${await displayLabel({ languageTag: this._languageTag, model: concept })}`,
    } satisfies Metadata;
  }

  async conceptScheme(conceptScheme: ConceptScheme): Promise<Metadata> {
    const rootPageMetadata = await this.languageTag();
    return {
      title: `${rootPageMetadata.title}: Concept Scheme: ${await displayLabel({ languageTag: this._languageTag, model: conceptScheme })}`,
    } satisfies Metadata;
  }

  async conceptSchemeTopConcepts(conceptScheme: ConceptScheme, _page: number) {
    const conceptSchemePageMetadata = await this.conceptScheme(conceptScheme);

    return {
      title: conceptSchemePageMetadata.title + ": Top concepts",
    } satisfies Metadata;
  }

  async conceptSemanticRelations(
    concept: Concept,
    semanticRelationProperty: SemanticRelationProperty,
  ) {
    const conceptPageMetadata = await this.concept(concept);

    return {
      title: `${conceptPageMetadata.title}: ${semanticRelationProperty.label} concepts`,
    } satisfies Metadata;
  }

  async languageTag(): Promise<Metadata> {
    const conceptSchemes = await kos.conceptSchemes();

    let title: string = "SKOS";
    if (conceptSchemes.length === 1) {
      const conceptScheme = conceptSchemes[0];
      const prefLabels = await conceptScheme.prefLabels({
        languageTags: new Set([this._languageTag, ""]),
      });
      if (prefLabels.length > 0) {
        title = prefLabels[0].literalForm.value;
      }
    }

    return {
      title: title,
    } satisfies Metadata;
  }

  async search(): Promise<Metadata> {
    return {
      title: `${(await this.languageTag()).title}: search results`,
    } satisfies Metadata;
  }
}
