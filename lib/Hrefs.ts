import { Configuration } from "@/lib/models/Configuration";
import {
  Concept,
  ConceptScheme,
  LanguageTag,
  SemanticRelationProperty,
} from "@kos-kit/models";
import { filenamify } from "@kos-kit/next-utils";
import queryString from "query-string";

export class Hrefs {
  private readonly _languageTag: LanguageTag;
  private readonly configuration: Configuration;

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

  get languageTag(): string {
    return `${this.configuration.nextBasePath}/${this._languageTag}`;
  }

  concept(concept: { identifier: Concept.Identifier }): string {
    return `${this.languageTag}/concepts/${filenamify(Concept.Identifier.toString(concept.identifier))}`;
  }

  conceptScheme(conceptScheme: {
    identifier: ConceptScheme.Identifier;
  }): string {
    return `${this.languageTag}/conceptSchemes/${filenamify(Concept.Identifier.toString(conceptScheme.identifier))}`;
  }

  conceptSchemeTopConcepts({
    conceptScheme,
    page,
  }: {
    conceptScheme: { identifier: ConceptScheme.Identifier };
    page: number;
  }): string {
    return `${this.conceptScheme(conceptScheme)}/topConcepts/${page}`;
  }

  conceptSemanticRelations({
    concept,
    semanticRelationProperty,
  }: {
    concept: { identifier: Concept.Identifier };
    semanticRelationProperty: SemanticRelationProperty;
  }): string {
    return `${this.concept(concept)}/semanticRelations/${semanticRelationProperty.name}`;
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
