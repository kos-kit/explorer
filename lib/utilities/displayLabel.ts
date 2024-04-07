import { LabeledModel } from "@/lib/models/LabeledModel";

export async function displayLabel({
  languageTag,
  model,
}: {
  languageTag: string;
  model: LabeledModel;
}): Promise<string> {}
