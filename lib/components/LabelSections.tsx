import { Section } from "@/lib/components/Section";
import { KosResource, Label, LabelProperty, labels } from "@/lib/models";
import { getTranslations } from "next-intl/server";
import React from "react";

function LabelSection({
  labels,
  title,
}: { labels: readonly Label[]; title: string }) {
  return (
    <Section title={title}>
      <ul className="list-disc list-inside">
        {labels.flatMap((label, labelI) =>
          label.literalForm.map((literalForm, literalFormI) => (
            <li key={`${labelI}-${literalFormI}`}>{literalForm.value}</li>
          )),
        )}
      </ul>
    </Section>
  );
}

export async function LabelSections({
  kosResource,
}: { kosResource: KosResource }) {
  const sections: React.ReactElement[] = [];
  const labels_ = labels(kosResource);
  const labelTypeTranslations = await getTranslations("LabelProperties");

  if (labels_.alternative.length > 0) {
    sections.push(
      <LabelSection
        labels={labels_.alternative}
        title={labelTypeTranslations(LabelProperty.ALT.translationKey)}
      />,
    );
  }

  if (labels_.hidden.length > 0) {
    sections.push(
      <LabelSection
        labels={labels_.hidden}
        title={labelTypeTranslations(LabelProperty.HIDDEN.translationKey)}
      />,
    );
  }

  return sections;
}
