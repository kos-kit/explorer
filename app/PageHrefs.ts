import { identifierToString } from "@/lib/utilities/identifierToString";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { filenamify } from "@/lib/utilities/filenamify";
import { SemanticRelationProperty } from "@/lib/models/SemanticRelationProperty";
import { Identifier } from "@/lib/models/Identifier";
import queryString from "query-string";

export class PageHrefs {
  static concept({
    basePath,
    conceptIdentifier,
    languageTag,
  }: {
    basePath: string;
    conceptIdentifier: Identifier;
    languageTag: LanguageTag;
  }): string {
    return `${PageHrefs.languageTag({ basePath, languageTag })}/concepts/${filenamify(identifierToString(conceptIdentifier))}`;
  }

  static conceptScheme({
    basePath,
    conceptSchemeIdentifier,
    languageTag,
  }: {
    basePath: string;
    conceptSchemeIdentifier: Identifier;
    languageTag: LanguageTag;
  }): string {
    return `${PageHrefs.languageTag({ basePath, languageTag })}/conceptSchemes/${filenamify(identifierToString(conceptSchemeIdentifier))}`;
  }

  static conceptSchemeTopConcepts({
    basePath,
    conceptSchemeIdentifier,
    languageTag,
    page,
  }: {
    basePath: string;
    conceptSchemeIdentifier: Identifier;
    languageTag: LanguageTag;
    page: number;
  }) {
    return `${PageHrefs.conceptScheme({ basePath, conceptSchemeIdentifier, languageTag })}/topConcepts/${page}`;
  }

  static conceptSemanticRelations({
    basePath,
    conceptIdentifier,
    languageTag,
    semanticRelationProperty,
  }: {
    basePath: string;
    conceptIdentifier: Identifier;
    languageTag: LanguageTag;
    semanticRelationProperty: SemanticRelationProperty;
  }) {
    return `${PageHrefs.concept({ basePath, conceptIdentifier, languageTag })}/semanticRelations/${semanticRelationProperty.name}`;
  }

  static languageTag({
    basePath,
    languageTag,
  }: {
    basePath: string;
    languageTag: LanguageTag;
  }) {
    return `${PageHrefs.root({ basePath })}${languageTag}`;
  }

  static root({ basePath }: { basePath: string }) {
    return `${basePath}/`;
  }

  static search({
    basePath,
    languageTag,
    page,
    query,
  }: {
    basePath: string;
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
      url: `${PageHrefs.languageTag({ basePath, languageTag })}/search`,
      query: searchParams,
    });
  }
}
