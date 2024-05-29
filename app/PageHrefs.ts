import { filenamify } from "@kos-kit/client/utilities";
import {
  Identifier,
  LanguageTag,
  SemanticRelationProperty,
} from "@kos-kit/client/models";
import { identifierToString } from "@kos-kit/client/utilities";
import queryString from "query-string";
import configuration from "./configuration";

export class PageHrefs {
  static concept({
    conceptIdentifier,
    languageTag,
  }: {
    conceptIdentifier: Identifier;
    languageTag: LanguageTag;
  }): string {
    return `${PageHrefs.languageTag({ languageTag })}/concepts/${filenamify(identifierToString(conceptIdentifier))}`;
  }

  static conceptScheme({
    conceptSchemeIdentifier,
    languageTag,
  }: {
    conceptSchemeIdentifier: Identifier;
    languageTag: LanguageTag;
  }): string {
    return `${PageHrefs.languageTag({ languageTag })}/conceptSchemes/${filenamify(identifierToString(conceptSchemeIdentifier))}`;
  }

  static conceptSchemeTopConcepts({
    conceptSchemeIdentifier,
    languageTag,
    page,
  }: {
    conceptSchemeIdentifier: Identifier;
    languageTag: LanguageTag;
    page: number;
  }) {
    return `${PageHrefs.conceptScheme({ conceptSchemeIdentifier, languageTag })}/topConcepts/${page}`;
  }

  static conceptSemanticRelations({
    conceptIdentifier,
    languageTag,
    semanticRelationProperty,
  }: {
    conceptIdentifier: Identifier;
    languageTag: LanguageTag;
    semanticRelationProperty: SemanticRelationProperty;
  }) {
    return `${PageHrefs.concept({ conceptIdentifier, languageTag })}/semanticRelations/${semanticRelationProperty.name}`;
  }

  static languageTag({ languageTag }: { languageTag: LanguageTag }) {
    return `${PageHrefs.root}${languageTag}`;
  }

  static get root() {
    return `${configuration.nextBasePath}/`;
  }

  static search({
    languageTag,
    page,
    query,
  }: {
    languageTag: LanguageTag;
    page?: number;
    query?: string;
  }) {
    const searchParams: { [index: string]: string } = {};
    if (page) {
      searchParams["page"] = page.toString();
    }
    if (query) {
      searchParams["query"] = query;
    }

    return queryString.stringifyUrl({
      url: `${PageHrefs.languageTag({ languageTag })}/search`,
      query: searchParams,
    });
  }
}
