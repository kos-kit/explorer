import configuration from "@/app/configuration";
import modelSet from "@/app/modelSet";
import { PageHrefs } from "@/app/PageHrefs";
import { ConceptList } from "@/lib/components/ConceptList";
import { Link } from "@/lib/components/Link";
import { Section } from "@/lib/components/Section";
import { Pagination } from "@/lib/components/Pagination";
import { defilenamify } from "@/lib/utilities/defilenamify";
import { filenamify } from "@/lib/utilities/filenamify";
import { pageCount } from "@/lib/utilities/pageCount";
import { Metadata } from "next";
import { Layout } from "@/lib/components/Layout";
import { displayLabel } from "@/lib/utilities/displayLabel";
import { PageMetadata } from "@/app/PageMetadata";
import { PageTitleHeading } from "@/lib/components/PageTitleHeading";
import { LanguageTag } from "@kos-kit/client/models";
import {
  identifierToString,
  stringToIdentifier,
} from "@kos-kit/client/utilities";

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
  const conceptScheme = await modelSet.conceptSchemeByIdentifier(
    stringToIdentifier(defilenamify(conceptSchemeIdentifier)),
  );

  const pageInt = parseInt(page);

  const topConceptsCount = await conceptScheme.topConceptsCount();

  return (
    <Layout languageTag={languageTag}>
      <PageTitleHeading>
        <Link
          href={PageHrefs.conceptScheme({
            basePath: configuration.nextBasePath,
            conceptSchemeIdentifier: conceptScheme.identifier,
            languageTag,
          })}
        >
          Concept Scheme:{" "}
          {await displayLabel({ languageTag, model: conceptScheme })}
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
          concepts={await conceptScheme.topConcepts({
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
              PageHrefs.conceptSchemeTopConcepts({
                basePath: configuration.nextBasePath,
                conceptSchemeIdentifier: conceptScheme.identifier,
                languageTag,
                page,
              })
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
  return PageMetadata.conceptSchemeTopConcepts({
    conceptScheme: await modelSet.conceptSchemeByIdentifier(
      stringToIdentifier(defilenamify(conceptSchemeIdentifier)),
    ),
    languageTag,
    page: parseInt(page),
  });
}

export async function generateStaticParams(): Promise<
  ConceptSchemeTopConceptsPageParams[]
> {
  const staticParams: ConceptSchemeTopConceptsPageParams[] = [];

  const languageTags = await modelSet.languageTags();

  for (const conceptScheme of await modelSet.conceptSchemes()) {
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
    for (const languageTag of languageTags) {
      for (let page = 0; page < pageCount_; page++) {
        staticParams.push({
          conceptSchemeIdentifier: filenamify(
            identifierToString(conceptScheme.identifier),
          ),
          languageTag,
          page: page.toString(),
        });
      }
    }
  }

  return staticParams;
}
