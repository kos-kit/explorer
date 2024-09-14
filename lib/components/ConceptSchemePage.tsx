import configuration from "@/app/configuration";
import { Hrefs } from "@/lib/Hrefs";
import { ConceptList } from "@/lib/components/ConceptList";
import { LabelSections } from "@/lib/components/LabelSections";
import { Layout } from "@/lib/components/Layout";
import { Link } from "@/lib/components/Link";
import { PageTitleHeading } from "@/lib/components/PageTitleHeading";
import { Section } from "@/lib/components/Section";
import { ConceptScheme, LanguageTag } from "@/lib/models";

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
      <LabelSections model={conceptScheme} />
      {topConceptsCount > 0 ? (
        <Section title="Top concepts">
          <div className="flex flex-col gap-2">
            <ConceptList
              concepts={
                await (
                  await conceptScheme.topConcepts({
                    limit: configuration.relatedConceptsPerSection,
                    offset: 0,
                  })
                ).flatResolve()
              }
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
