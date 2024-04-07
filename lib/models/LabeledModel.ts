import { Label } from "@/lib/models/Label";
import { Model } from "@/lib/models/Model";
import { LanguageTag } from "./LanguageTag";

export interface LabeledModel extends Model {
  altLabels(languageTag: LanguageTag): Promise<readonly Label[]>;
  hiddenLabels(languageTag: LanguageTag): Promise<readonly Label[]>;
  prefLabels(languageTag: LanguageTag): Promise<readonly Label[]>;
}
