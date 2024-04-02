import { Label } from "@/lib/models/Label";
import { Model } from "@/lib/models/Model";
import { LanguageTag } from "./LanguageTag";

export interface LabeledModel extends Model {
  readonly altLabels: Iterable<Label>;
  readonly hiddenLabels: Iterable<Label>;
  prefLabel(languageTag: LanguageTag): Label | null;
  readonly prefLabels: Iterable<Label>;
}
