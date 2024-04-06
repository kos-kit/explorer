import { Label } from "@/lib/models/Label";
import { LabeledModel } from "@/lib/models/LabeledModel";

export const behavesLikeLabeledModel = (model: LabeledModel) => {
  const expectLabels = (labels: readonly Label[]) => {
    expect(labels).toBeDefined();
    for (const label of labels) {
      expect(label.literalForm.value).not.toHaveLength(0);
    }
  };

  it("should get altLabels", async () => {
    expectLabels(await model.altLabels());
  });

  it("should get hiddenLabels", async () => {
    expectLabels(await model.hiddenLabels());
  });

  it("should get prefLabels", async () => {
    const prefLabels = await model.prefLabels();
    expect(model.prefLabels).not.toHaveLength(0);
    expectLabels(prefLabels);
  });
};
