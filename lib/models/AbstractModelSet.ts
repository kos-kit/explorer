import { ModelSet } from "@/lib/models/ModelSet";
import { Concept } from "./Concept";
import { ConceptScheme } from "./ConceptScheme";
import { Identifier } from "./Identifier";
import { LanguageTag } from "./LanguageTag";
import { LabeledModel } from "./LabeledModel";

export abstract class AbstractModelSet implements ModelSet {
  protected cachedLanguageTags: readonly LanguageTag[] | null = null;

  abstract conceptByIdentifier(identifier: Identifier): Promise<Concept>;

  async *concepts(): AsyncGenerator<Concept, any, unknown> {
    const conceptsCount = await this.conceptsCount();
    const limit = 100;
    let offset = 0;
    while (offset < conceptsCount) {
      for (const concept of await this.conceptsPage({ limit, offset })) {
        yield concept;
      }
      offset++;
    }
  }

  abstract conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]>;

  abstract conceptsCount(): Promise<number>;

  abstract conceptSchemeByIdentifier(
    identifier: Identifier,
  ): Promise<ConceptScheme>;

  abstract conceptSchemes(): Promise<readonly ConceptScheme[]>;

  async languageTags(): Promise<readonly string[]> {
    if (this.cachedLanguageTags !== null) {
      return this.cachedLanguageTags;
    }

    // Sample models in the set for their labels' language tags
    const sampleLabeledModels: LabeledModel[] = [];
    sampleLabeledModels.push(...(await this.conceptSchemes()));
    sampleLabeledModels.push(
      ...(await this.conceptsPage({ limit: 100, offset: 0 })),
    );

    const sampleLanguageTags: Set<LanguageTag> = new Set();
    for (const sampleLabeledModel of sampleLabeledModels) {
      for (const sampleLabels of [
        await sampleLabeledModel.prefLabels(),
        await sampleLabeledModel.altLabels(),
      ]) {
        for (const sampleLabel of sampleLabels) {
          sampleLanguageTags.add(sampleLabel.literalForm.language);
        }
      }
    }

    this.cachedLanguageTags = [...sampleLanguageTags];
    return this.cachedLanguageTags;
  }
}
