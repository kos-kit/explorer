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
  readonly searchResults: readonly SearchResult[];
}

export class LunrSearchEngine implements SearchEngine {
  private constructor(
    private readonly indicesByLanguageTag: {
      [index: string]: LunrSearchEngineIndex;
    },
  ) {}

  static async create(modelSet: ModelSet): Promise<LunrSearchEngine> {
    const indicesByLanguageTag: { [index: string]: LunrSearchEngineIndex } = {};

    for (const languageTag of await modelSet.languageTags()) {
      type IndexDocument = {
        readonly id: number; // Use a numeric id to make the index more compact.
        readonly labels: readonly string[];
      };

      const toIndexObjects = async (
        id: number,
        model: LabeledModel & { identifier: Identifier },
        type: SearchResultType,
      ): Promise<[IndexDocument, SearchResult] | null> => {
        const prefLabels = await model.prefLabels(languageTag);
        if (prefLabels.length === 0) {
          return null;
        }
        const altLabels = await model.altLabels(languageTag);
        const hiddenLabels = await model.hiddenLabels(languageTag);

        return [
          {
            id,
            labels: [altLabels, hiddenLabels, prefLabels].flatMap((labels) =>
              labels.map((label) => label.literalForm.value),
            ),
          },
          {
            identifier: identifierToString(model.identifier),
            prefLabel: prefLabels[0].literalForm.value,
            type,
          },
        ];
      };

      const indexObjectPromises: Promise<
        [IndexDocument, SearchResult] | null
      >[] = [];
      let id = 0;
      for await (const concept of modelSet.concepts()) {
        indexObjectPromises.push(toIndexObjects(id++, concept, "Concept"));
      }
      indexObjectPromises.push(
        ...(await modelSet.conceptSchemes()).map((conceptScheme) =>
          toIndexObjects(id++, conceptScheme, "ConceptScheme"),
        ),
      );
      const indexObjects = await Promise.all(indexObjectPromises);

      const searchResults: SearchResult[] = [];
      indicesByLanguageTag[languageTag] = {
        index: lunr(function () {
          this.ref("identifier");
          this.field("labels");
          for (const indexObject of indexObjects) {
            if (indexObject === null) {
              continue;
            }
            const [indexDocument, searchResult] = indexObject;
            this.add(indexDocument);
            searchResults.push(searchResult);
          }
        }),
        searchResults,
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
          ...index.searchResults[parseInt(lunrResult.ref)],
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
