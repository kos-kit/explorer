import { LabeledModel } from "../models/LabeledModel";

export function LabelTable({ model }: { model: LabeledModel }) {
  return (
    <table className="border-spacing-x-2 lg:border-spacing-x-8">
      <thead>
        <th className="font-i">Label</th>
        <th>Language</th>
        <th>Type</th>
      </thead>
      <tbody>
        {[
          { labels: model.prefLabels, type: "Preferred" },
          { labels: model.altLabels, type: "Alternate" },
          { labels: model.hiddenLabels, type: "Hidden" },
        ].flatMap(({ labels, type }) =>
          labels.map((label, labelIndex) => (
            <tr key={type + labelIndex.toString()}>
              <td>{label.literalForm.value}</td>
              <td>{label.literalForm.language}</td>
              <td>{type}</td>
            </tr>
          )),
        )}
      </tbody>
    </table>
  );
}
