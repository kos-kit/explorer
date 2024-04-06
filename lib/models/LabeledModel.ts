import { Label } from "@/lib/models/Label";
import { Model } from "@/lib/models/Model";
import { LanguageTag } from "./LanguageTag";

export interface LabeledModel extends Model {
  altLabels(): Promise<readonly Label[]>;
  hiddenLabels(): Promise<readonly Label[]>;
  prefLabel(languageTag: LanguageTag): Promise<Label | null>;
  prefLabels(): Promise<readonly Label[]>;
}
