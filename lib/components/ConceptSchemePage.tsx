import { configuration } from "@/app/configuration";
import { ConceptList } from "@/lib/components/ConceptList";
import { LabelSections } from "@/lib/components/LabelSections";
import { Layout } from "@/lib/components/Layout";
import { Link } from "@/lib/components/Link";
import { PageTitleHeading } from "@/lib/components/PageTitleHeading";
import { Section } from "@/lib/components/Section";
import { getHrefs } from "@/lib/getHrefs";
import { ConceptScheme, Kos, Labels } from "@/lib/models";
import { getTranslations } from "next-intl/server";

export async function ConceptSchemePage({
  conceptScheme,
  kos,
}: {
  conceptScheme: ConceptScheme;
  kos: Kos;
}) {
  const hrefs = await getHrefs();
  const translations = await getTranslations("ConceptSchemePage");
  const topConcepts = await kos.conceptStubs({
    limit: configuration.relatedConceptsPerSection,
    offset: 0,
    query: {
      conceptSchemeIdentifier: conceptScheme.identifier,
      type: "TopConceptOf",
    },
  });
  const topConceptsCount = await kos.conceptsCount({
    conceptSchemeIdentifier: conceptScheme.identifier,
    type: "TopConceptOf",
  });

  return (
    <Layout>
      <PageTitleHeading>
        {translations("Concept scheme")}: {new Labels(conceptScheme).display}
      </PageTitleHeading>
      <LabelSections kosResource={conceptScheme} />
      {topConceptsCount > 0 ? (
        <Section title={translations("Top concepts")}>
          <div className="flex flex-col gap-2">
            <ConceptList concepts={topConcepts} />
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
