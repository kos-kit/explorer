import { Label } from "@/lib/models/Label";
import { Model } from "@/lib/models/Model";
import { LanguageTag } from "./LanguageTag";

export interface LabeledModel extends Model {
  readonly altLabels: readonly Label[];
  readonly hiddenLabels: readonly Label[];
  prefLabel(languageTag: LanguageTag): Label | null;
  readonly prefLabels: readonly Label[];
}
