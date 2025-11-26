import { expect, it } from "vitest";
import { createSearchEngineFromJson } from "../createSearchEngineFromJson.js";
export const behavesLikeSearchEngine = (lazySearchEngine) => {
    const expectUnescoThesaurusConcept10Result = async (searchEngine) => {
        const query = "right to education";
        const results = await searchEngine.search({
            languageTag: "en",
            limit: 10,
            offset: 0,
            query,
        });
        expect(results.total).toBeGreaterThan(0);
        expect(results.page).not.toHaveLength(0);
        const result = results.page.find((result) => result.identifier ===
            "<http://vocabularies.unesco.org/thesaurus/concept10>");
        expect(result).toBeDefined();
        expect(result.prefLabel).toStrictEqual("Right to education");
        expect(result.type).toEqual("Concept");
    };
    it("should find a specific concept by its prefLabel", async () => {
        await expectUnescoThesaurusConcept10Result(await lazySearchEngine());
    });
    it("should serialize to and from JSON", async () => {
        const serverSearchEngine = await lazySearchEngine();
        await expectUnescoThesaurusConcept10Result(serverSearchEngine);
        const serverSearchEngineJson = serverSearchEngine.toJson();
        expect(serverSearchEngineJson.type).toBeDefined();
        const clientSearchEngine = createSearchEngineFromJson(serverSearchEngineJson);
        await expectUnescoThesaurusConcept10Result(clientSearchEngine);
    });
};
//# sourceMappingURL=behavesLikeSearchEngine.js.map