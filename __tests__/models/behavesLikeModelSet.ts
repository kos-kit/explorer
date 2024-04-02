import { ModelSet } from "@/lib/models/ModelSet";

export const behavesLikeModelSet = (modelSet: ModelSet) => {
  it("should get concept schemes", () => {
    expect([...modelSet.conceptSchemes]).toHaveLength(1);
  });
};
