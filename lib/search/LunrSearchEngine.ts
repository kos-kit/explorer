import lunr, { Index } from "lunr";
import { ModelSet } from "@/lib/models/ModelSet";
import { SearchEngine } from "@/lib/search/SearchEngine";
import { SearchResult } from "@/lib/search/SearchResult";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { SearchResultType } from "./SearchResultType";
import { LabeledModel } from "@/lib/models/LabeledModel";
import { Identifier } from "@/lib/models/Identifier";
import { identifierToString } from "@/lib/utilities/identifierToString";

interface LunrSearchEngineIndex {
  readonly index: Index;
  readonly searchResultsByIdentifier: Record<string, SearchResult>;
}

export class LunrSearchEngine implements SearchEngine {
  private constructor(
    private readonly indicesByLanguageTag: Record<
      string,
      LunrSearchEngineIndex
    >,
  ) {}

  static async create(
    modelSet: ModelSet,
    options?: { conceptsLimit: number },
  ): Promise<LunrSearchEngine> {
    const conceptsLimit = options?.conceptsLimit;
    const indicesByLanguageTag: { [index: string]: LunrSearchEngineIndex } = {};

    for (const languageTag of await modelSet.languageTags()) {
      type IndexDocument = {
        readonly identifier: string;
        readonly joinedLabels: string;
      };

      const toIndexObjects = async (
        model: LabeledModel & { identifier: Identifier },
        type: SearchResultType,
      ): Promise<[IndexDocument, SearchResult] | null> => {
        const prefLabels = await model.prefLabels(languageTag);
        if (prefLabels.length === 0) {
          return null;
        }
        const altLabels = await model.altLabels(languageTag);
        const hiddenLabels = await model.hiddenLabels(languageTag);

        const identifierString = identifierToString(model.identifier);

        return [
          {
            identifier: identifierString,
            joinedLabels: [altLabels, hiddenLabels, prefLabels]
              .flatMap((labels) =>
                labels.map((label) => label.literalForm.value),
              )
              .join(" "),
          },
          {
            identifier: identifierString,
            prefLabel: prefLabels[0].literalForm.value,
            score: 0,
            type,
          },
        ];
      };

      const indexObjectPromises: Promise<
        [IndexDocument, SearchResult] | null
      >[] = [];

      if (conceptsLimit != null) {
        // Don't index all concepts in the set, in testing
        for (const concept of await modelSet.conceptsPage({
          limit: conceptsLimit,
          offset: 0,
        })) {
          indexObjectPromises.push(toIndexObjects(concept, "Concept"));
        }
      } else {
        // Index all concepts in the set
        for await (const concept of await modelSet.concepts()) {
          indexObjectPromises.push(toIndexObjects(concept, "Concept"));
        }
      }

      // Index concept schemes
      indexObjectPromises.push(
        ...(await modelSet.conceptSchemes()).map((conceptScheme) =>
          toIndexObjects(conceptScheme, "ConceptScheme"),
        ),
      );

      const indexObjects = await Promise.all(indexObjectPromises);

      const searchResultsByIdentifier: Record<string, SearchResult> = {};
      indicesByLanguageTag[languageTag] = {
        index: lunr(function () {
          this.ref("identifier");
          this.field("joinedLabels");
          for (const indexObject of indexObjects) {
            if (indexObject === null) {
              continue;
            }
            const [indexDocument, searchResult] = indexObject;
            this.add(indexDocument);
            searchResultsByIdentifier[searchResult.identifier] = searchResult;
          }
        }),
        searchResultsByIdentifier,
      };
    }

    return new LunrSearchEngine(indicesByLanguageTag);
  }

  search({
    languageTag,
    limit,
    offset,
    query,
  }: {
    languageTag: LanguageTag;
    limit: number;
    offset: number;
    query: string;
  }): Promise<readonly SearchResult[]> {
    return new Promise((resolve) => {
      const index = this.indicesByLanguageTag[languageTag];
      if (!index) {
        resolve([]);
        return;
      }

      const results: SearchResult[] = [];
      let lunrResultCount = 0;
      for (const lunrResult of index.index.search(query)) {
        if (lunrResultCount++ < offset) {
          continue;
        }

        results.push({
          ...index.searchResultsByIdentifier[lunrResult.ref],
          score: lunrResult.score,
        });
        if (results.length === limit) {
          break;
        }
      }
      resolve(results);
    });
  }
}
