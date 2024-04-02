import modelSet from "@/app/modelSet";
import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { slugify } from "@/lib/utilities/slugify";

interface ConceptSchemePageParams {
  conceptSchemeIdentifierSlug: string;
  language: string;
}

export default function ConceptSchemePage({
  conceptSchemeIdentifierSlug,
  language,
}: ConceptSchemePageParams) {
  const getConceptScheme = (): ConceptScheme => {
    for (const conceptScheme of modelSet.conceptSchemes) {
      if (
        slugify(identifierToString(conceptScheme.identifier)) ===
        conceptSchemeIdentifierSlug
      ) {
        return conceptScheme;
      }
    }
    throw new RangeError();
  };

  const conceptScheme = getConceptScheme();
  const prefLabel =
    conceptScheme.prefLabel(language)?.literalForm.value ??
    identifierToString(conceptScheme.identifier);

  return (
    <div className="flex flex-col gap-8">
      <h1>Concept Scheme: {prefLabel}</h1>;
    </div>
  );
}
