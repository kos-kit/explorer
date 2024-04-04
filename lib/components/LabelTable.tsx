import { LabeledModel } from "../models/LabeledModel";

export function LabelTable({ model }: { model: LabeledModel }) {
  return (
    <table>
      <thead>
        <th>Label</th>
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
