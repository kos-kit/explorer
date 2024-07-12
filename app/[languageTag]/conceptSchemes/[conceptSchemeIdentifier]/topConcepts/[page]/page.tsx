import configuration from "@/app/configuration";
import { ConceptList } from "@/lib/components/ConceptList";
import { Link } from "@/lib/components/Link";
import { Section } from "@/lib/components/Section";
import { Pagination } from "@/lib/components/Pagination";
import { decodeFileName, encodeFileName, pageCount } from "@kos-kit/next-utils";
import { Metadata } from "next";
import { Layout } from "@/lib/components/Layout";
import { PageMetadata } from "@/app/PageMetadata";
import { PageTitleHeading } from "@/lib/components/PageTitleHeading";
import { ConceptScheme, LanguageTag } from "@kos-kit/models";
import { Hrefs } from "@/lib/Hrefs";
import { notFound } from "next/navigation";
import kosFactory from "@/app/kosFactory";
import { dataFactory } from "@/lib/dataFactory";

interface ConceptSchemeTopConceptsPageParams {
  conceptSchemeIdentifier: string;
  languageTag: LanguageTag;
  page: string;
}

export default async function ConceptSchemeTopConceptsPage({
  params: { conceptSchemeIdentifier, languageTag, page },
}: {
  params: ConceptSchemeTopConceptsPageParams;
}) {
  const conceptScheme = (
    await (
      await kosFactory({
        languageTag,
      })
    ).conceptSchemeByIdentifier(
      ConceptScheme.Identifier.fromString({
        dataFactory,
        identifier: decodeFileName(conceptSchemeIdentifier),
      }),
    )
  ).extractNullable();
  if (!conceptScheme) {
    notFound();
  }

  const hrefs = new Hrefs({ configuration, languageTag });

  const pageInt = parseInt(page);

  const topConceptsCount = await conceptScheme.topConceptsCount();

  return (
    <Layout languageTag={languageTag}>
      <PageTitleHeading>
        <Link href={hrefs.conceptScheme(conceptScheme)}>
          Concept Scheme: {conceptScheme.displayLabel}
        </Link>
      </PageTitleHeading>
      <Section
        title={
          <span>
            Top concepts (Page {pageInt + 1} of{" "}
            {pageCount({
              itemsPerPage: configuration.conceptsPerPage,
              itemsTotal: topConceptsCount,
            })}
            )
          </span>
        }
      >
        <ConceptList
          concepts={await conceptScheme.topConceptsPage({
            limit: configuration.conceptsPerPage,
            offset: parseInt(page) * configuration.conceptsPerPage,
          })}
          languageTag={languageTag}
        />
        <div className="flex justify-center">
          <Pagination
            currentPage={pageInt}
            itemsPerPage={configuration.conceptsPerPage}
            itemsTotal={topConceptsCount}
            pageHref={(page) =>
              hrefs.conceptSchemeTopConcepts({ conceptScheme, page })
            }
          />
        </div>
      </Section>
    </Layout>
  );
}

export async function generateMetadata({
  params: { conceptSchemeIdentifier, languageTag, page },
}: {
  params: ConceptSchemeTopConceptsPageParams;
}): Promise<Metadata> {
  const conceptScheme = (
    await (
      await kosFactory({ languageTag })
    ).conceptSchemeByIdentifier(
      ConceptScheme.Identifier.fromString({
        dataFactory,
        identifier: decodeFileName(conceptSchemeIdentifier),
      }),
    )
  ).extractNullable();
  if (!conceptScheme) {
    return {};
  }
  return (
    (await new PageMetadata({ languageTag }).conceptSchemeTopConcepts({
      conceptScheme,
      page: parseInt(page),
    })) ?? {}
  );
}

export async function generateStaticParams(): Promise<
  ConceptSchemeTopConceptsPageParams[]
> {
  if (configuration.dynamic) {
    return [];
  }

  const staticParams: ConceptSchemeTopConceptsPageParams[] = [];

  for (const languageTag of configuration.languageTags) {
    for (const conceptScheme of await (
      await kosFactory({
        languageTag,
      })
    ).conceptSchemes()) {
      const topConceptsCount = await conceptScheme.topConceptsCount();
      if (topConceptsCount <= configuration.relatedConceptsPerSection) {
        // Top concepts will fit on the concept scheme page, no need for this page.
        continue;
      }
      const pageCount_ = pageCount({
        itemsPerPage: configuration.conceptsPerPage,
        itemsTotal: topConceptsCount,
      });
      // Top concepts will spill over from the concept scheme page to this one.
      for (let page = 0; page < pageCount_; page++) {
        staticParams.push({
          conceptSchemeIdentifier: encodeFileName(
            ConceptScheme.Identifier.toString(conceptScheme.identifier),
          ),
          languageTag,
          page: page.toString(),
        });
      }
    }
  }

  return staticParams;
}
