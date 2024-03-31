import { Label } from "./Label";
import { Model } from "./Model";

export interface LabeledModel extends Model {
  readonly altLabels: readonly Label[];
  readonly hiddenLabel: readonly Label[];
  readonly prefLabels: readonly Label[];
}
