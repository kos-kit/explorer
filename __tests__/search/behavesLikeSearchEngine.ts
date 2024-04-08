import { SearchEngine } from "@/lib/search/SearchEngine";
import { createSearchEngineFromClientJson } from "@/lib/search/createSearchEngineFromClientJson";

export const behavesLikeSearchEngine = (
  lazySearchEngine: () => Promise<SearchEngine>,
) => {
  const expectUnescoThesaurusConcept10Result = async (
    searchEngine: SearchEngine,
  ) => {
    const results = await searchEngine.search({
      limit: 10,
      offset: 0,
      languageTag: "en",
      query: "right to education",
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

  it("should serialize to and from client JSON", async () => {
    const serverSearchEngine = await lazySearchEngine();
    await expectUnescoThesaurusConcept10Result(serverSearchEngine);
    const clientSearchEngine = createSearchEngineFromClientJson(
      serverSearchEngine.toClientJson(),
    );
    await expectUnescoThesaurusConcept10Result(clientSearchEngine);
  });
};
