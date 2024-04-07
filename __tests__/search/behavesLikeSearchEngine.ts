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
      query: "Family size",
    });
    console.log(results);
  });
};
