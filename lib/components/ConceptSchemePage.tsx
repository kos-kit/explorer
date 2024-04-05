import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { ConceptList } from "@/lib/components/ConceptList";
import { Link } from "@/lib/components/Link";
import { Pages } from "@/app/Pages";
import configuration from "@/app/configuration";
import { LabelTable } from "@/lib/components/LabelTable";
import { Section } from "./Section";
import { Layout } from "@/lib/components/Layout";

export function ConceptSchemePage({
  conceptScheme,
  languageTag,
}: {
  conceptScheme: ConceptScheme;
  languageTag: LanguageTag;
}) {
  const topConceptsCount = conceptScheme.topConceptsCount;

  return (
    <Layout
      languageTag={languageTag}
      title={
        <span>
          Concept Scheme:{" "}
          {conceptScheme.prefLabel(languageTag)?.literalForm.value ??
            identifierToString(conceptScheme.identifier)}
        </span>
      }
    >
      <Section title="Labels">
        <LabelTable model={conceptScheme} />
      </Section>
      {topConceptsCount > 0 ? (
        <Section title="Top concepts">
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
        </Section>
      ) : null}
    </Layout>
  );
}
