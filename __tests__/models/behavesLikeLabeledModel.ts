import { Label } from "@/lib/models/Label";
import { LabeledModel } from "@/lib/models/LabeledModel";

export const behavesLikeLabeledModel = (
  lazyModel: () => Promise<LabeledModel>,
) => {
  const expectLabels = (labels: readonly Label[]) => {
    expect(labels).toBeDefined();
    for (const label of labels) {
      expect(label.literalForm.value).not.toHaveLength(0);
    }
  };

  it("should get altLabels", async () => {
    const model = await lazyModel();
    expectLabels(await model.altLabels());
  });

  it("should get hiddenLabels", async () => {
    const model = await lazyModel();
    expectLabels(await model.hiddenLabels());
  });

  it("should get prefLabels", async () => {
    const model = await lazyModel();
    const prefLabels = await model.prefLabels();
    expect(prefLabels).not.toHaveLength(0);
    expectLabels(prefLabels);
  });
};
