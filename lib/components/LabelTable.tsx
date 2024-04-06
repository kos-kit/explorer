import { LabeledModel } from "../models/LabeledModel";

export function LabelTable({ model }: { model: LabeledModel }) {
  return (
    <table className="w-full">
      <thead>
        <th className="font-normal">&nbsp;</th>
        <th className="font-normal text-left underline">Language</th>
        <th className="font-normal text-left underline">Type</th>
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
