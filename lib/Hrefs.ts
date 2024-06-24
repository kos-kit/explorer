import { LanguageTag, SemanticRelationProperty } from "@kos-kit/models";
import queryString from "query-string";
import { Configuration } from "@/lib/models/Configuration";
import { Resource } from "@kos-kit/rdf-resource";
import { filenamify } from "@kos-kit/next-utils";

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

  concept(concept: { identifier: Resource.Identifier }): string {
    return `${this.languageTag}/concepts/${filenamify(Resource.Identifier.toString(concept.identifier))}`;
  }

  conceptScheme(conceptScheme: { identifier: Resource.Identifier }): string {
    return `${this.languageTag}/conceptSchemes/${filenamify(Resource.Identifier.toString(conceptScheme.identifier))}`;
  }

  conceptSchemeTopConcepts({
    conceptScheme,
    page,
  }: {
    conceptScheme: { identifier: Resource.Identifier };
    page: number;
  }): string {
    return `${this.conceptScheme(conceptScheme)}/topConcepts/${page}`;
  }

  conceptSemanticRelations({
    concept,
    semanticRelationProperty,
  }: {
    concept: { identifier: Resource.Identifier };
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
