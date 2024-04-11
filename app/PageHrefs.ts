import { identifierToString } from "@/lib/utilities/identifierToString";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { filenamify } from "@/lib/utilities/filenamify";
import { SemanticRelationProperty } from "@/lib/models/SemanticRelationProperty";
import { Identifier } from "@/lib/models/Identifier";
import queryString from "query-string";

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
    return "/";
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
      searchParams.page = page.toString();
    }
    if (query) {
      searchParams.query = query;
    }

    return queryString.stringifyUrl({
      url: `${PageHrefs.languageTag({ languageTag })}/search`,
      query: searchParams,
    });
  }
}
