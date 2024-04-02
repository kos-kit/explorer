import { ModelSet } from "@/lib/models/ModelSet";

export const behavesLikeModelSet = (modelSet: ModelSet) => {
  it("should get concept schemes", () => {
    expect([...modelSet.conceptSchemes]).toHaveLength(1);
  });

  it("should get language tags", () => {
    expect([...modelSet.languageTags]).not.toHaveLength(0);
  });
};
