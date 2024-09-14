import { Section } from "@/lib/components/Section";
import { Label, LabeledModel } from "@/lib/models";
import React from "react";

export function LabelSections({ model }: { model: LabeledModel }) {
  const sections: React.ReactElement[] = [];

  for (const { labels, type } of [
    { labels: model.labels(Label.Type.PREFERRED), type: "Preferred" },
    { labels: model.labels(Label.Type.ALTERNATIVE), type: "Alternate" },
    { labels: model.labels(Label.Type.HIDDEN), type: "Hidden" },
  ]) {
    if (labels.length === 0 || (type === "Preferred" && labels.length === 1)) {
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
