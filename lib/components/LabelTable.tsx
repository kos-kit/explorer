import { LabeledModel } from "../models/LabeledModel";

export function LabelTable({ model }: { model: LabeledModel }) {
  return (
    <table className="border-separate border-spacing-x-2 lg:border-spacing-x-8">
      <thead>
        <th className="font-normal">&nbsp;</th>
        <th className="font-normal">Language</th>
        <th className="font-normal">Type</th>
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
