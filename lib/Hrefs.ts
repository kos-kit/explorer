import { LanguageTag, SemanticRelationProperty } from "@kos-kit/models";
import queryString from "query-string";
import { Configuration } from "@/lib/models/Configuration";
import { filenamify } from "@kos-kit/next-utils";
import { Identifier } from "@/lib/models/Identifier";

export class Hrefs {
  private readonly configuration: Configuration;
  private readonly _languageTag: LanguageTag;

  constructor({
    configuration,
    languageTag,
  }: {
    configuration: Configuration;
    languageTag: LanguageTag;
  }) {
    this.configuration = configuration;
    this._languageTag = languageTag;
  }

  concept(concept: { identifier: Identifier }): string {
    return `${this.languageTag}/concepts/${filenamify(Identifier.toString(concept.identifier))}`;
  }

  conceptScheme(conceptScheme: { identifier: Identifier }): string {
    return `${this.languageTag}/conceptSchemes/${filenamify(Identifier.toString(conceptScheme.identifier))}`;
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
    return `${this.concept(concept)}/semanticRelations/${semanticRelationProperty.name}`;
  }

  get languageTag(): string {
    return `${this.configuration.nextBasePath}/${this._languageTag}`;
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
      url: `${this.languageTag}/search`,
      query: searchParams,
    });
  }
}
