import { Label } from "@/lib/models/Label";
import { Model } from "@/lib/models/Model";
import { LanguageTag } from "./LanguageTag";

export interface LabeledModel extends Model {
  altLabels(kwds?: { languageTag?: LanguageTag }): Promise<readonly Label[]>;
  hiddenLabels(kwds?: { languageTag?: LanguageTag }): Promise<readonly Label[]>;
  prefLabels(kwds?: { languageTag?: LanguageTag }): Promise<readonly Label[]>;
}
