import { Kos, KosResource, LanguageTag, labels } from "@kos-kit/models";
import lunr, { Index } from "lunr";
import { List } from "purify-ts";
import * as rdfjsResource from "rdfjs-resource";
import { LunrIndexCompactor } from "./LunrIndexCompactor.js";
import { SearchEngine } from "./SearchEngine.js";
import { SearchEngineJson } from "./SearchEngineJson.js";
import { SearchResult } from "./SearchResult.js";
import { SearchResults } from "./SearchResults.js";

/**
 * A SearchEngine implementation built with Lunr.js, so it can be used in the browser.
 */
export class LunrSearchEngine implements SearchEngine {
  private constructor(
    private readonly documents: Record<string, Record<string, string>>, // type -> identifier -> prefLabel
    private readonly index: Index,
    private readonly languageTag: LanguageTag,
  ) {}

  static async create({
    conceptsLimit,
    languageTag,
    kos,
  }: {
    conceptsLimit?: number;
    languageTag: LanguageTag;
    kos: Kos;
  }): Promise<LunrSearchEngine> {
    interface IndexDocument {
      readonly identifier: string;
      readonly joinedLabels: string;
      readonly prefLabel: string;
      readonly type: SearchResult["type"];
    }

    const toIndexDocument = (
      kosResource: KosResource,
      type: SearchResult["type"],
    ): IndexDocument | null => {
      const kosResourceLabels = labels(kosResource);
      const prefLabel = kosResourceLabels.preferred
        .chain((_) => List.head(_.literalForm))
        .extract();
      if (!prefLabel) {
        return null;
      }

      const identifierString = rdfjsResource.Resource.Identifier.toString(
        kosResource.$identifier,
      );

      return {
        identifier: identifierString,
        joinedLabels: kosResourceLabels.preferred
          .toList()
          .concat(kosResourceLabels.alternative)
          .concat(kosResourceLabels.hidden)
          .flatMap((label) => label.literalForm.map((literal) => literal.value))
          .join(" "),
        prefLabel: prefLabel.value,
        type,
      };
    };

    const indexDocuments: (IndexDocument | null)[] = [];

    if (conceptsLimit != null) {
      // Don't index all concepts in the set, in testing
      for (const conceptStub of (
        await kos.conceptStubs({
          limit: conceptsLimit,
          offset: 0,
          query: { type: "All" },
        })
      ).orDefault([])) {
        (await kos.concept(conceptStub.$identifier)).ifRight((concept) =>
          indexDocuments.push(toIndexDocument(concept, "Concept")),
        );
      }
    } else {
      // Index all concepts in the set
      for (const conceptStub of (
        await kos.conceptStubs({
          limit: null,
          offset: 0,
          query: { type: "All" },
        })
      ).orDefault([])) {
        (await kos.concept(conceptStub.$identifier)).ifRight((concept) =>
          indexDocuments.push(toIndexDocument(concept, "Concept")),
        );
      }
    }

    // Index concept schemes
    for (const conceptSchemeStub of (
      await kos.conceptSchemeStubs({
        limit: null,
        offset: 0,
        query: { type: "All" },
      })
    ).orDefault([])) {
      (await kos.conceptScheme(conceptSchemeStub.$identifier)).ifRight(
        (conceptScheme) =>
          indexDocuments.push(toIndexDocument(conceptScheme, "ConceptScheme")),
      );
    }

    const compactIndexDocuments: Record<string, Record<string, string>> = {};
    const index = lunr(function () {
      this.ref("identifier");
      this.field("joinedLabels");
      for (const indexDocument of indexDocuments) {
        if (indexDocument === null) {
          continue;
        }
        this.add(indexDocument);

        let compactIndexDocumentsByIdentifier =
          compactIndexDocuments[indexDocument.type];
        if (!compactIndexDocumentsByIdentifier) {
          compactIndexDocumentsByIdentifier = compactIndexDocuments[
            indexDocument.type
          ] = {};
        }
        compactIndexDocumentsByIdentifier[indexDocument.identifier] =
          indexDocument.prefLabel;
      }
    });

    return new LunrSearchEngine(compactIndexDocuments, index, languageTag);
  }

  static fromJson(json: SearchEngineJson) {
    const lunrIndexCompactor = new LunrIndexCompactor();
    return new LunrSearchEngine(
      json["documents"],
      lunrIndexCompactor.expandLunrIndex(json["index"]),
      json["languageTag"],
    );
  }

  async search({
    languageTag,
    limit,
    offset,
    query,
  }: {
    languageTag: LanguageTag;
    limit: number;
    offset: number;
    query: string;
  }): Promise<SearchResults> {
    if (this.languageTag !== languageTag) {
      throw new RangeError(
        `expected language tag '${this.languageTag}', actual '${languageTag}`,
      );
    }

    const indexResults = this.index.search(query);

    const page: SearchResult[] = [];
    for (const indexResult of indexResults.slice(offset)) {
      for (const documentType of Object.keys(this.documents)) {
        const documentPrefLabel = this.documents[documentType][indexResult.ref];

        if (!documentPrefLabel) {
          continue;
        }

        page.push({
          identifier: indexResult.ref,
          prefLabel: documentPrefLabel,
          type: documentType as SearchResult["type"],
        });
        if (page.length === limit) {
          return { page, total: indexResults.length };
        }
        break;
      }
    }
    return { page, total: indexResults.length };
  }

  toJson(): SearchEngineJson {
    const lunrIndexCompactor = new LunrIndexCompactor();
    return {
      documents: this.documents,
      index: lunrIndexCompactor.compactLunrIndex(this.index),
      languageTag: this.languageTag,
      type: "Lunr",
    };
  }
}
