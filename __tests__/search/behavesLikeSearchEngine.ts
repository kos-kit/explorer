import { SearchEngine } from "@/lib/search/SearchEngine";

export const behavesLikeSearchEngine = (
  lazySearchEngine: () => Promise<SearchEngine>,
) => {
  it("should find a specific concept by its prefLabel", async () => {
    const searchEngine = await lazySearchEngine();
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
  });
};
