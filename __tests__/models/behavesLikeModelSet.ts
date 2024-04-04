import { ModelSet } from "@/lib/models/ModelSet";

export const behavesLikeModelSet = (modelSet: ModelSet) => {
  it("should get concepts", () => {
    const firstConcepts = [...modelSet.concepts({ limit: 10, offset: 0 })];
    expect(firstConcepts).toHaveLength(10);

    const nextConcepts = [...modelSet.concepts({ limit: 10, offset: 10 })];
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

  it("should get a concept by its identifier", () => {
    for (const concept of modelSet.concepts({ limit: 1, offset: 0 })) {
      expect(
        concept.identifier.equals(
          modelSet.conceptByIdentifier(concept.identifier).identifier,
        ),
      ).toBeTruthy();
      return;
    }
    fail();
  });

  it("should get a count of concepts", () => {
    expect(modelSet.conceptsCount).toBeGreaterThan(0);
  });

  it("should get concept schemes", () => {
    expect(modelSet.conceptSchemes).toHaveLength(1);
  });

  it("should get a concept scheme by an identifier", () => {
    for (const conceptScheme of modelSet.conceptSchemes) {
      expect(
        conceptScheme.identifier.equals(
          modelSet.conceptSchemeByIdentifier(conceptScheme.identifier)
            .identifier,
        ),
      ).toBeTruthy();
    }
  });

  it("should get language tags", () => {
    expect(modelSet.languageTags).not.toHaveLength(0);
  });
};
