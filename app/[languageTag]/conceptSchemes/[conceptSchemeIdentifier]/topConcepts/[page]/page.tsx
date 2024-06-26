import configuration from "@/app/configuration";
import { ConceptList } from "@/lib/components/ConceptList";
import { Link } from "@/lib/components/Link";
import { Section } from "@/lib/components/Section";
import { Pagination } from "@/lib/components/Pagination";
import { defilenamify, filenamify, pageCount } from "@kos-kit/next-utils";
import { Metadata } from "next";
import { Layout } from "@/lib/components/Layout";
import { PageMetadata } from "@/app/PageMetadata";
import { PageTitleHeading } from "@/lib/components/PageTitleHeading";
import { LanguageTag } from "@kos-kit/models";
import { Hrefs } from "@/lib/Hrefs";
import kosFactory from "../../../../../kosFactory";
import * as O from "fp-ts/Option";
import { notFound } from "next/navigation";
import { pipe } from "fp-ts/lib/function";
import { Identifier } from "@/lib/models/Identifier";

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
  const conceptScheme = O.toNullable(
    await (
      await kosFactory({
        languageTag,
      })
    ).conceptSchemeByIdentifier(
      Identifier.fromString(defilenamify(conceptSchemeIdentifier)),
    ),
  );
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
  return pipe(
    await (
      await kosFactory({ languageTag })
    ).conceptSchemeByIdentifier(
      Identifier.fromString(defilenamify(conceptSchemeIdentifier)),
    ),
    O.map((conceptScheme) =>
      new PageMetadata({ languageTag }).conceptSchemeTopConcepts({
        conceptScheme,
        page: parseInt(page),
      }),
    ),
    O.getOrElse(() => ({}) satisfies Metadata),
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
          conceptSchemeIdentifier: filenamify(
            Identifier.toString(conceptScheme.identifier),
          ),
          languageTag,
          page: page.toString(),
        });
      }
    }
  }

  return staticParams;
}
