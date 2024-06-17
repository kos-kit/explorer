import React from "react";
import { Section } from "@/lib/components/Section";
import { LabeledModel } from "@kos-kit/models";

export async function LabelSections({ model }: { model: LabeledModel }) {
  const sections: React.ReactElement[] = [];

  for (const { labels, type } of [
    { labels: model.prefLabels, type: "Preferred" },
    { labels: model.altLabels, type: "Alternate" },
    { labels: model.hiddenLabels, type: "Hidden" },
  ]) {
    if (labels.length === 0 || (type == "Preferred" && labels.length === 1)) {
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
