import { ConceptList } from "@/lib/components/ConceptList";
import { Link } from "@/lib/components/Link";
import configuration from "@/app/configuration";
import { LabelSections } from "@/lib/components/LabelSections";
import { Section } from "@/lib/components/Section";
import { Layout } from "@/lib/components/Layout";
import { PageTitleHeading } from "@/lib/components/PageTitleHeading";
import { ConceptScheme, LanguageTag } from "@kos-kit/client/models";
import { Hrefs } from "../Hrefs";

export async function ConceptSchemePage({
  conceptScheme,
  languageTag,
}: {
  conceptScheme: ConceptScheme;
  languageTag: LanguageTag;
}) {
  const topConceptsCount = await conceptScheme.topConceptsCount();

  return (
    <Layout languageTag={languageTag}>
      <PageTitleHeading>
        Concept Scheme: {conceptScheme.displayLabel}
      </PageTitleHeading>
      <LabelSections languageTag={languageTag} model={conceptScheme} />
      {topConceptsCount > 0 ? (
        <Section title="Top concepts">
          <div className="flex flex-col gap-2">
            <ConceptList
              concepts={await conceptScheme.topConceptsPage({
                limit: configuration.relatedConceptsPerSection,
                offset: 0,
              })}
              languageTag={languageTag}
            />
            {topConceptsCount > configuration.relatedConceptsPerSection ? (
              <Link
                href={new Hrefs({
                  configuration,
                  languageTag,
                }).conceptSchemeTopConcepts({ conceptScheme, page: 0 })}
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
