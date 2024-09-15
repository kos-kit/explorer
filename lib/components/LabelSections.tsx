import { Section } from "@/lib/components/Section";
import { Label, LabeledModel } from "@/lib/models";
import { getTranslations } from "next-intl/server";
import React from "react";

export async function LabelSections({ model }: { model: LabeledModel }) {
  const sections: React.ReactElement[] = [];
  const labelTypeTranslations = await getTranslations("LabelTypes");

  for (const labelType of Label.Types) {
    const labels = model.labels({ types: [labelType] });

    if (
      labels.length === 0 ||
      (labelType === Label.Type.PREFERRED && labels.length === 1)
    ) {
      continue;
    }

    sections.push(
      <Section
        title={labelTypeTranslations(
          `${labelType.literalProperty.value.replaceAll(".", "_")}`,
        )}
      >
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
