import { PageMetadata } from "@/app/PageMetadata";
import { configuration } from "@/app/configuration";
import { kosFactory } from "@/app/kosFactory";
import { ConceptList } from "@/lib/components/ConceptList";
import { Layout } from "@/lib/components/Layout";
import { Link } from "@/lib/components/Link";
import { PageTitleHeading } from "@/lib/components/PageTitleHeading";
import { Pagination } from "@/lib/components/Pagination";
import { Section } from "@/lib/components/Section";
import { dataFactory } from "@/lib/dataFactory";
import { getHrefs } from "@/lib/getHrefs";
import { Identifier, Locale } from "@/lib/models";
import { decodeFileName, encodeFileName, pageCount } from "@kos-kit/next-utils";
import { Metadata } from "next";
import { unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

interface ConceptSchemeTopConceptsPageParams {
  conceptSchemeIdentifier: string;
  locale: Locale;
  page: string;
}

export default async function ConceptSchemeTopConceptsPage({
  params: { conceptSchemeIdentifier, locale, page },
}: {
  params: ConceptSchemeTopConceptsPageParams;
}) {
  unstable_setRequestLocale(locale);

  const conceptScheme = (
    await (
      await kosFactory({
        locale,
      })
    )
      .conceptScheme(
        Identifier.fromString({
          dataFactory,
          identifier: decodeFileName(conceptSchemeIdentifier),
        }),
      )
      .resolve()
  )
    .toMaybe()
    .extractNullable();
  if (!conceptScheme) {
    notFound();
  }

  const hrefs = await getHrefs();

  const pageInt = Number.parseInt(page);

  const topConceptsCount = await conceptScheme.topConceptsCount();

  return (
    <Layout>
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
          concepts={
            await (
              await conceptScheme.topConcepts({
                limit: configuration.conceptsPerPage,
                offset: Number.parseInt(page) * configuration.conceptsPerPage,
              })
            ).flatResolve()
          }
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
  params: { conceptSchemeIdentifier, locale, page },
}: {
  params: ConceptSchemeTopConceptsPageParams;
}): Promise<Metadata> {
  const conceptScheme = (
    await (
      await kosFactory({ locale })
    )
      .conceptScheme(
        Identifier.fromString({
          dataFactory,
          identifier: decodeFileName(conceptSchemeIdentifier),
        }),
      )
      .resolve()
  )
    .toMaybe()
    .extractNullable();
  if (!conceptScheme) {
    return {};
  }
  return (
    (await new PageMetadata({ locale }).conceptSchemeTopConcepts({
      conceptScheme,
      page: Number.parseInt(page),
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

  for (const locale of configuration.locales) {
    for (const conceptScheme of await (
      await (
        await kosFactory({
          locale,
        })
      ).conceptSchemes({ limit: null, offset: 0, query: { type: "All" } })
    ).flatResolve()) {
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
            Identifier.toString(conceptScheme.identifier),
          ),
          locale,
          page: page.toString(),
        });
      }
    }
  }

  return staticParams;
}