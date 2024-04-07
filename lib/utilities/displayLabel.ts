import { LabeledModel } from "@/lib/models/LabeledModel";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { Identifier } from "@/lib/models/Identifier";

export async function displayLabel({
  languageTag,
  model,
}: {
  languageTag: string;
  model: LabeledModel & { readonly identifier: Identifier };
}): Promise<string> {
  for (const languageTag_ of [languageTag, ""]) {
    const prefLabels = await model.prefLabels(languageTag_);
    if (prefLabels.length > 0) {
      return prefLabels[0].literalForm.value;
    }
  }
  return identifierToString(model.identifier);
}
