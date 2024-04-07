import { LabeledModel } from "@/lib/models/LabeledModel";
import { LanguageTag } from "@/lib/models/LanguageTag";
import React from "react";
import { Section } from "@/lib/components/Section";

export async function LabelSections({
  languageTag,
  model,
}: {
  languageTag: LanguageTag;
  model: LabeledModel;
}) {
  const sections: React.ReactElement[] = [];
  for (const { labels, type } of [
    { labels: await model.prefLabels(languageTag), type: "Preferred" },
    { labels: await model.altLabels(languageTag), type: "Alternate" },
    { labels: await model.hiddenLabels(languageTag), type: "Hidden" },
  ]) {
    if (labels.length === 0) {
      continue;
    }
    sections.push(
      <Section title={`${type} labels`}>
        <ul className="list-disc list-inside">
          {labels.map((label, labelI) => (
            <li key={labelI}>{label.literalForm.value}</li>
          ))}
        </ul>
      </Section>,
    );
  }
  return sections;
}
