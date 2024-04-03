import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { ConceptList } from "@/lib/components/ConceptList";

export function ConceptSchemePage({
  conceptScheme,
  languageTag,
}: {
  conceptScheme: ConceptScheme;
  languageTag: LanguageTag;
}) {
  const prefLabel =
    conceptScheme.prefLabel(languageTag)?.literalForm.value ??
    identifierToString(conceptScheme.identifier);

  const topConceptsCount = conceptScheme.topConceptsCount;

  return (
    <div className="flex flex-col gap-8">
      <h1>Concept Scheme: {prefLabel}</h1>
      {topConceptsCount > 0 ? (
        <section>
          <h2>Top concepts</h2>
          <ConceptList
            concepts={[...conceptScheme.topConcepts({ limit: 10, offset: 0 })]}
            languageTag={languageTag}
          />
        </section>
      ) : null}
    </div>
  );
}
