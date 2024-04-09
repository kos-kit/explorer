import { ModelSet } from "@/lib/models/ModelSet";

export const behavesLikeModelSet = (modelSet: ModelSet) => {
  it("should get concepts", async () => {
    const firstConcepts = await modelSet.conceptsPage({ limit: 10, offset: 0 });
    expect(firstConcepts).toHaveLength(10);

    const nextConcepts = await modelSet.conceptsPage({ limit: 10, offset: 10 });
    expect(nextConcepts).toHaveLength(10);
    for (const nextConcept of nextConcepts) {
      expect(
        firstConcepts.every(
          (firstConcept) =>
            !firstConcept.identifier.equals(nextConcept.identifier),
        ),
      ).toBeTruthy();
    }
  });

  it("should get a concept by its identifier", async () => {
    for (const concept of await modelSet.conceptsPage({
      limit: 1,
      offset: 0,
    })) {
      expect(
        concept.identifier.equals(
          (await modelSet.conceptByIdentifier(concept.identifier)).identifier,
        ),
      ).toBeTruthy();
      return;
    }
    fail();
  });

  it("should get a count of concepts", async () => {
    expect(await modelSet.conceptsCount()).toStrictEqual(4482);
  });

  it("should get concept schemes", async () => {
    expect(await modelSet.conceptSchemes()).toHaveLength(1);
  });

  it("should get a concept scheme by an identifier", async () => {
    for (const conceptScheme of await modelSet.conceptSchemes()) {
      expect(
        conceptScheme.identifier.equals(
          (await modelSet.conceptSchemeByIdentifier(conceptScheme.identifier))
            .identifier,
        ),
      ).toBeTruthy();
    }
  });

  it("should get language tags", async () => {
    const languageTags = await modelSet.languageTags();
    expect(languageTags).not.toHaveLength(0);
    expect(languageTags).toContain("en");
    expect(languageTags).toContain("fr");
  });
};
