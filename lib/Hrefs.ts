import { Identifier, Locale, SemanticRelationProperty } from "@/lib/models";
import { encodeFileName } from "@kos-kit/next-utils";
import queryString from "query-string";

export class Hrefs {
  private readonly _locale: Locale;
  private readonly nextBasePath: string;

  constructor({
    locale,
    nextBasePath,
  }: {
    locale: Locale;
    nextBasePath: string;
  }) {
    this._locale = locale;
    this.nextBasePath = nextBasePath;
  }

  get locale(): string {
    return `${this.nextBasePath}/${this._locale}`;
  }

  concept(concept: { identifier: Identifier }): string {
    return `${this.locale}/concepts/${encodeFileName(Identifier.toString(concept.identifier))}`;
  }

  conceptScheme(conceptScheme: { identifier: Identifier }): string {
    return `${this.locale}/conceptSchemes/${encodeFileName(Identifier.toString(conceptScheme.identifier))}`;
  }

  conceptSchemeTopConcepts({
    conceptScheme,
    page,
  }: {
    conceptScheme: { identifier: Identifier };
    page: number;
  }): string {
    return `${this.conceptScheme(conceptScheme)}/topConcepts/${page}`;
  }

  conceptSemanticRelations({
    concept,
    semanticRelationProperty,
  }: {
    concept: { identifier: Identifier };
    semanticRelationProperty: SemanticRelationProperty;
  }): string {
    return `${this.concept(concept)}/semanticRelations/${encodeFileName(Identifier.toString(semanticRelationProperty.identifier))}`;
  }

  search({ page, query }: { page?: number; query?: string }) {
    const searchParams: Record<string, string> = {};
    if (page) {
      searchParams["page"] = page.toString();
    }
    if (query) {
      searchParams["query"] = query;
    }

    return queryString.stringifyUrl({
      url: `${this.locale}/search`,
      query: searchParams,
    });
  }
}
