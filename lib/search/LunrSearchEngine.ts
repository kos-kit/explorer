import lunr, { Index } from "lunr";
import { ModelSet } from "@/lib/models/ModelSet";
import { SearchEngine } from "@/lib/search/SearchEngine";
import { SearchResult } from "@/lib/search/SearchResult";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { LabeledModel } from "@/lib/models/LabeledModel";
import { Identifier } from "@/lib/models/Identifier";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { LunrIndexCompactor } from "@/lib/search/LunrIndexCompactor";
import { SearchEngineJson } from "@/lib/search/SearchEngineJson";

export class LunrSearchEngine implements SearchEngine {
  private constructor(
    private readonly documents: Record<string, Record<string, string>>, // type -> identifier -> prefLabel
    private readonly index: Index,
  ) {}

  static async create({
    conceptsLimit,
    languageTag,
    modelSet,
  }: {
    conceptsLimit?: number;
    languageTag: LanguageTag;
    modelSet: ModelSet;
  }): Promise<LunrSearchEngine> {
    type IndexDocument = {
      readonly identifier: string;
      readonly joinedLabels: string;
      readonly prefLabel: string;
      readonly type: SearchResult["type"];
    };

    const toIndexDocument = async (
      model: LabeledModel & { identifier: Identifier },
      type: SearchResult["type"],
    ): Promise<IndexDocument | null> => {
      const prefLabels = await model.prefLabels({ languageTag });
      if (prefLabels.length === 0) {
        return null;
      }
      const altLabels = await model.altLabels({ languageTag });
      const hiddenLabels = await model.hiddenLabels({ languageTag });

      const identifierString = identifierToString(model.identifier);

      return {
        identifier: identifierString,
        joinedLabels: [altLabels, hiddenLabels, prefLabels]
          .flatMap((labels) => labels.map((label) => label.literalForm.value))
          .join(" "),
        prefLabel: prefLabels[0].literalForm.value,
        type,
      };
    };

    const indexDocumentPromises: Promise<IndexDocument | null>[] = [];

    if (conceptsLimit != null) {
      // Don't index all concepts in the set, in testing
      for (const concept of await modelSet.conceptsPage({
        limit: conceptsLimit,
        offset: 0,
      })) {
        indexDocumentPromises.push(toIndexDocument(concept, "Concept"));
      }
    } else {
      // Index all concepts in the set
      for await (const concept of await modelSet.concepts()) {
        indexDocumentPromises.push(toIndexDocument(concept, "Concept"));
      }
    }

    // Index concept schemes
    indexDocumentPromises.push(
      ...(await modelSet.conceptSchemes()).map((conceptScheme) =>
        toIndexDocument(conceptScheme, "ConceptScheme"),
      ),
    );

    const indexDocuments = await Promise.all(indexDocumentPromises);

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

    return new LunrSearchEngine(compactIndexDocuments, index);
  }

  static fromJson(json: SearchEngineJson) {
    const lunrIndexCompactor = new LunrIndexCompactor();
    return new LunrSearchEngine(
      json["documents"],
      lunrIndexCompactor.expandLunrIndex(json["index"]),
    );
  }

  search({
    limit,
    offset,
    query,
  }: {
    limit: number;
    offset: number;
    query: string;
  }): Promise<readonly SearchResult[]> {
    return new Promise((resolve) => {
      const results: SearchResult[] = [];
      let lunrResultCount = 0;
      for (const lunrResult of this.index.search(query)) {
        if (lunrResultCount++ < offset) {
          continue;
        }

        for (const documentType of Object.keys(this.documents)) {
          const documentPrefLabel =
            this.documents[documentType][lunrResult.ref];

          if (!documentPrefLabel) {
            continue;
          }

          results.push({
            identifier: lunrResult.ref,
            prefLabel: documentPrefLabel,
            score: lunrResult.score,
            type: documentType as SearchResult["type"],
          });
          if (results.length === limit) {
            resolve(results);
            return;
          }
          break;
        }
      }
      resolve(results);
    });
  }

  searchCount({ query }: { query: string }): Promise<number> {
    return new Promise((resolve) => {
      resolve(this.index.search(query).length);
    });
  }

  toJson(): SearchEngineJson {
    const lunrIndexCompactor = new LunrIndexCompactor();
    return {
      documents: this.documents,
      index: lunrIndexCompactor.compactLunrIndex(this.index),
      type: "Lunr",
    };
  }
}
