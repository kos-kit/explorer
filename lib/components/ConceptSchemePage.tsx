import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { ConceptsList } from "@/lib/components/ConceptsList";
import { Link } from "@/lib/components/Link";
import { Pages } from "@/lib/Pages";
import { Pagination } from "@/lib/components/Pagination";
import { conceptsPerPage } from "../conceptsPerPage";
import configuration from "@/app/configuration";

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
          <div className="flex flex-col gap-2">
            <ConceptsList
              concepts={[
                ...conceptScheme.topConcepts({
                  limit: configuration.relatedConceptsPerSection,
                  offset: 0,
                }),
              ]}
              languageTag={languageTag}
            />
            {topConceptsCount > configuration.relatedConceptsPerSection ? (
              <Link
                href={
                  Pages.conceptSchemeTopConcepts({
                    conceptScheme,
                    languageTag,
                    page: 0,
                  }).href
                }
              >
                More
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
