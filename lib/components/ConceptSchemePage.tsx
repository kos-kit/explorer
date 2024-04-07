import { ConceptScheme } from "@/lib/models/ConceptScheme";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { ConceptList } from "@/lib/components/ConceptList";
import { Link } from "@/lib/components/Link";
import configuration from "@/app/configuration";
import { LabelTable } from "@/lib/components/LabelTable";
import { Section } from "@/lib/components/Section";
import { Layout } from "@/lib/components/Layout";
import { displayLabel } from "@/lib/utilities/displayLabel";
import { PageHrefs } from "@/app/PageHrefs";

export async function ConceptSchemePage({
  conceptScheme,
  languageTag,
}: {
  conceptScheme: ConceptScheme;
  languageTag: LanguageTag;
}) {
  const topConceptsCount = await conceptScheme.topConceptsCount();

  return (
    <Layout
      languageTag={languageTag}
      title={
        <span>
          Concept Scheme:{" "}
          {await displayLabel({ languageTag, model: conceptScheme })}
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
              concepts={await conceptScheme.topConcepts({
                limit: configuration.relatedConceptsPerSection,
                offset: 0,
              })}
              languageTag={languageTag}
            />
            {topConceptsCount > configuration.relatedConceptsPerSection ? (
              <Link
                href={PageHrefs.conceptSchemeTopConcepts({
                  conceptSchemeIdentifier: conceptScheme.identifier,
                  languageTag,
                  page: 0,
                })}
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
