import { configuration } from "@/app/configuration";
import { ConceptList } from "@/lib/components/ConceptList";
import { LabelSections } from "@/lib/components/LabelSections";
import { Layout } from "@/lib/components/Layout";
import { Link } from "@/lib/components/Link";
import { PageTitleHeading } from "@/lib/components/PageTitleHeading";
import { Section } from "@/lib/components/Section";
import { getHrefs } from "@/lib/getHrefs";
import { ConceptScheme } from "@/lib/models";
import { getTranslations } from "next-intl/server";

export async function ConceptSchemePage({
  conceptScheme,
}: {
  conceptScheme: ConceptScheme;
}) {
  const hrefs = await getHrefs();
  const topConceptsCount = await conceptScheme.topConceptsCount();
  const translations = await getTranslations("ConceptSchemePage");

  return (
    <Layout>
      <PageTitleHeading>
        {translations("Concept scheme")}: {conceptScheme.displayLabel}
      </PageTitleHeading>
      <LabelSections model={conceptScheme} />
      {topConceptsCount > 0 ? (
        <Section title={translations("Top concepts")}>
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
            />
            {topConceptsCount > configuration.relatedConceptsPerSection ? (
              <Link
                href={hrefs.conceptSchemeTopConcepts({
                  conceptScheme,
                  page: 0,
                })}
              >
                {translations("More")}
              </Link>
            ) : null}
          </div>
        </Section>
      ) : null}
    </Layout>
  );
}
