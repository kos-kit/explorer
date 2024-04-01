import { Label } from "./Label";
import { Model } from "./Model";

export interface LabeledModel extends Model {
  altLabels(): Iterable<Label>;
  hiddenLabels(): Iterable<Label>;
  prefLabels(): Iterable<Label>;
}
