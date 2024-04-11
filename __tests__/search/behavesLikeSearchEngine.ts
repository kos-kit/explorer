import { SearchEngine } from "@/lib/search/SearchEngine";
import { createSearchEngineFromJson } from "@/lib/search/createSearchEngineFromJson";

export const behavesLikeSearchEngine = (
  lazySearchEngine: () => Promise<SearchEngine>,
) => {
  const expectUnescoThesaurusConcept10Result = async (
    searchEngine: SearchEngine,
  ) => {
    const query = "right to education";

    const count = await searchEngine.searchCount({ query });
    expect(count).toBeGreaterThan(0);

    const results = await searchEngine.search({
      limit: 10,
      offset: 0,
      query,
    });
    expect(results).not.toHaveLength(0);
    const result = results.find(
      (result) =>
        result.identifier ===
        "<http://vocabularies.unesco.org/thesaurus/concept10>",
    );
    expect(result).toBeDefined();
    expect(result!.prefLabel).toStrictEqual("Right to education");
    expect(result!.score).toBeGreaterThan(0);
    expect(result!.type).toEqual("Concept");
  };

  it("should find a specific concept by its prefLabel", async () => {
    await expectUnescoThesaurusConcept10Result(await lazySearchEngine());
  });

  it("should serialize to and from JSON", async () => {
    const serverSearchEngine = await lazySearchEngine();
    await expectUnescoThesaurusConcept10Result(serverSearchEngine);
    const serverSearchEngineJson = serverSearchEngine.toJson();
    expect(serverSearchEngineJson.type).toBeDefined();
    const clientSearchEngine = createSearchEngineFromJson(
      serverSearchEngineJson,
    );
    await expectUnescoThesaurusConcept10Result(clientSearchEngine);
  });
};
