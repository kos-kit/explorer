import { Identifier, LabeledModel } from "@kos-kit/client/models";
import { identifierToString } from "@kos-kit/client/utilities";

export async function displayLabel({
  languageTag,
  model,
}: {
  languageTag: string;
  model: LabeledModel & { readonly identifier: Identifier };
}): Promise<string> {
  for (const languageTag_ of [languageTag, ""]) {
    const prefLabels = await model.prefLabels({
      languageTags: new Set([languageTag_]),
    });
    if (prefLabels.length > 0) {
      return prefLabels[0].literalForm.value;
    }
  }
  return identifierToString(model.identifier);
}
