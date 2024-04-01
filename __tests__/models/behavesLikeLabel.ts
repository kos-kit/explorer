import { Label } from "@/lib/models/Label";

export const behavesLikeLabel = (label: Label) => {
  it("should have a non-empty literalForm", () => {
    expect(label.literalForm.value).not.toHaveLength(0);
  });
};
