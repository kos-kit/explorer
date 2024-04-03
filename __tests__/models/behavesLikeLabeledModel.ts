import { Label } from "@/lib/models/Label";
import { LabeledModel } from "@/lib/models/LabeledModel";

export const behavesLikeLabeledModel = (model: LabeledModel) => {
  const expectLabels = (labels: Iterable<Label>) => {
    expect(labels).toBeDefined();
    for (const label of labels) {
      expect(label.literalForm.value).not.toHaveLength(0);
    }
  };

  it("should get altLabels", () => {
    expectLabels(model.altLabels);
  });

  it("should get hiddenLabels", () => {
    expectLabels(model.hiddenLabels);
  });

  it("should get prefLabels", () => {
    const prefLabels = model.prefLabels;
    expect(model.prefLabels).not.toHaveLength(0);
    expectLabels(prefLabels);
  });
};
