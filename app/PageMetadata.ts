import { kosFactory } from "@/app/kosFactory";
import { Concept, ConceptScheme, Label, Locale } from "@/lib/models";
import { Concept as LibConcept } from "@kos-kit/models";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export class PageMetadata {
  private readonly _locale: Locale;

  constructor({ locale }: { locale: Locale }) {
    this._locale = locale;
  }

  async concept(concept: Concept): Promise<Metadata> {
    const rootPageMetadata = await this.locale();
    const translations = await getTranslations({
      locale: this._locale,
      namespace: "PageMetadata",
    });
    return {
      title: `${rootPageMetadata.title}: ${translations("Concept")}: ${concept.displayLabel}`,
    } satisfies Metadata;
  }

  async conceptScheme(conceptScheme: ConceptScheme): Promise<Metadata> {
    const rootPageMetadata = await this.locale();
    const translations = await getTranslations({
      locale: this._locale,
      namespace: "PageMetadata",
    });
    return {
      title: `${rootPageMetadata.title}: ${translations("Concept scheme")}: ${conceptScheme.displayLabel}`,
    } satisfies Metadata;
  }

  async conceptSchemeTopConcepts({
    conceptScheme,
  }: {
    conceptScheme: ConceptScheme;
    page: number;
  }) {
    const conceptSchemePageMetadata = await this.conceptScheme(conceptScheme);
    const translations = await getTranslations({
      locale: this._locale,
      namespace: "PageMetadata",
    });

    return {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-base-to-string
      title: `${conceptSchemePageMetadata.title!.toString()}: ${translations("Top concepts")}`,
    } satisfies Metadata;
  }

  async conceptSemanticRelations({
    concept,
    semanticRelationType,
  }: {
    concept: Concept;
    semanticRelationType: LibConcept.SemanticRelation.Type;
  }) {
    const conceptPageMetadata = await this.concept(concept);

    const translations = await getTranslations({
      locale: this._locale,
      namespace: "SemanticRelationProperties",
    });

    return {
      title: `${conceptPageMetadata.title}: ${translations(semanticRelationType.property.value)}`,
    } satisfies Metadata;
  }

  async locale(): Promise<Metadata> {
    const conceptSchemes = await (
      await (
        await kosFactory({
          locale: this._locale,
        })
      ).conceptSchemes({ limit: null, offset: 0, query: { type: "All" } })
    ).flatResolve();

    let title = "SKOS";
    if (conceptSchemes.length === 1) {
      const conceptScheme = conceptSchemes[0];
      const prefLabels = conceptScheme.labels({
        types: [Label.Type.PREFERRED],
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
    const translations = await getTranslations({
      locale: this._locale,
      namespace: "PageMetadata",
    });

    return {
      title: `${(await this.locale()).title}: ${translations("Search results")}`,
    } satisfies Metadata;
  }
}
