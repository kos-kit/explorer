import { Label } from "@/lib/models/Label";
import { Model } from "@/lib/models/Model";

export interface LabeledModel extends Model {
  readonly altLabels: Iterable<Label>;
  readonly hiddenLabels: Iterable<Label>;
  prefLabel(language: string): Label | null;
  readonly prefLabels: Iterable<Label>;
}
