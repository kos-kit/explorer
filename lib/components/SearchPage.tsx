"use client";

import { Hrefs } from "@/lib/Hrefs";
import { Link } from "@/lib/components/Link";
import { ClientConfigurationContext } from "@/lib/contexts";
import { dataFactory } from "@/lib/dataFactory";
import { useHrefs } from "@/lib/hooks/useHrefs";
import { ClientConfiguration, Identifier, Locale } from "@/lib/models";
import {
  SearchEngineJson,
  SearchResult,
  SearchResults,
  createSearchEngineFromJson,
} from "@kos-kit/search";
import {
  AbstractIntlMessages,
  NextIntlClientProvider,
  useLocale,
  useTranslations,
} from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { PageTitleHeading } from "./PageTitleHeading";
import { Pagination } from "./Pagination";

function AnimatedSpinner() {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      className="animate-spin -ml-1 mr-3 h-16 w-16 text-black"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function searchResultHref({
  hrefs,
  searchResult,
}: {
  hrefs: Hrefs;
  searchResult: SearchResult;
}): string {
  switch (searchResult.type) {
    case "Concept":
      return hrefs.concept({
        identifier: Identifier.fromString({
          dataFactory,
          identifier: searchResult.identifier,
        }),
      });
    case "ConceptScheme":
      return hrefs.conceptScheme({
        identifier: Identifier.fromString({
          dataFactory,
          identifier: searchResult.identifier,
        }),
      });
  }
}

interface SearchPageProps {
  configuration: ClientConfiguration;
  searchEngineJson: SearchEngineJson;
}

function SearchPageImpl({ configuration, searchEngineJson }: SearchPageProps) {
  const hrefs = useHrefs();
  const locale = useLocale();
  const resultsPerPage = configuration.conceptsPerPage;
  const searchParams = useSearchParams();
  const pageString = searchParams?.get("page");
  let page = pageString ? Number.parseInt(pageString) : 0;
  if (Number.isNaN(page)) {
    page = 0;
  }
  const query = searchParams?.get("query");
  const translations = useTranslations();

  const [error, setError] = useState<Error | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(
    null,
  );

  useEffect(() => {
    if (!query) {
      setError(new Error("Invalid query"));
      return;
    }

    const searchEngine = createSearchEngineFromJson(searchEngineJson);

    searchEngine
      .search({
        languageTag: locale,
        limit: resultsPerPage,
        offset: page * resultsPerPage,
        query,
      })
      .then(setSearchResults, setError);
  }, [locale, page, query, resultsPerPage, searchEngineJson]);

  if (error) {
    return (
      <>
        <PageTitleHeading>{translations("Error")}</PageTitleHeading>
        <p>{error.message}</p>
      </>
    );
  }

  const heading = (
    <PageTitleHeading>
      {translations("Search results", { query })}
    </PageTitleHeading>
  );
  if (searchResults === null) {
    return (
      <>
        {heading}
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <h2 className="font-normal text-lg text-center">Loading...</h2>
            <AnimatedSpinner />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {heading}
      <ul>
        {searchResults.page.map((searchResult, searchResultI) => (
          <li key={searchResultI}>
            {searchResult.type}:&nbsp;
            <Link
              href={searchResultHref({
                hrefs,
                searchResult,
              })}
            >
              <b>{searchResult.prefLabel}</b>
            </Link>
          </li>
        ))}
      </ul>
      <Pagination
        currentPage={page}
        itemsPerPage={resultsPerPage}
        itemsTotal={searchResults.total}
        pageHref={(page) =>
          hrefs.search({
            page,
            query: query ?? undefined,
          })
        }
      />
    </>
  );
}

export function SearchPage({
  configuration,
  locale,
  messages,
  ...otherProps
}: SearchPageProps & { locale: Locale; messages: AbstractIntlMessages }) {
  // https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
  return (
    <Suspense>
      <ClientConfigurationContext.Provider value={configuration}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SearchPageImpl configuration={configuration} {...otherProps} />
        </NextIntlClientProvider>
      </ClientConfigurationContext.Provider>
    </Suspense>
  );
}
