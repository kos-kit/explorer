import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { ConceptList } from "@/lib/components/ConceptList";
import { Link } from "@/lib/components/Link";
import { Pages } from "@/app/Pages";
import configuration from "@/app/configuration";
import { LabelTable } from "@/lib/components/LabelTable";
import { PageTitle } from "@/lib/components/PageTitle";
import { PageSection } from "./PageSection";

export function ConceptSchemePage({
  conceptScheme,
  languageTag,
}: {
  conceptScheme: ConceptScheme;
  languageTag: LanguageTag;
}) {
  const topConceptsCount = conceptScheme.topConceptsCount;

  return (
    <>
      <PageTitle>
        Concept Scheme:{" "}
        {conceptScheme.prefLabel(languageTag)?.literalForm.value ??
          identifierToString(conceptScheme.identifier)}
      </PageTitle>
      <PageSection title="Labels">
        <LabelTable model={conceptScheme} />
      </PageSection>
      {topConceptsCount > 0 ? (
        <PageSection title="Top concepts">
          <div className="flex flex-col gap-2">
            <ConceptList
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
        </PageSection>
      ) : null}
    </>
  );
}
