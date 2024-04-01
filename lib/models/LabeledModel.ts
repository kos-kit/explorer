import { Label } from "@/lib/models/Label";
import { Model } from "@/lib/models/Model";

export interface LabeledModel extends Model {
  altLabels(): Iterable<Label>;
  hiddenLabels(): Iterable<Label>;
  prefLabels(): Iterable<Label>;
}
