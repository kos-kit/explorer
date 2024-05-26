"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { PageTitleHeading } from "./PageTitleHeading";
import { PageHrefs } from "@/app/PageHrefs";
import { Link } from "@/lib/components/Link";
import { Pagination } from "./Pagination";
import {
  SearchEngineJson,
  SearchResult,
  createSearchEngineFromJson,
} from "@kos-kit/client/search";
import { stringToIdentifier } from "@kos-kit/client/utilities";
import { LanguageTag } from "@kos-kit/client/models";

function AnimatedSpinner() {
  return (
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
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

function searchResultHref({
  basePath,
  languageTag,
  searchResult,
}: {
  basePath: string;
  languageTag: LanguageTag;
  searchResult: SearchResult;
}): string {
  switch (searchResult.type) {
    case "Concept":
      return PageHrefs.concept({
        basePath,
        conceptIdentifier: stringToIdentifier(searchResult.identifier),
        languageTag,
      });
    case "ConceptScheme":
      return PageHrefs.conceptScheme({
        basePath,
        conceptSchemeIdentifier: stringToIdentifier(searchResult.identifier),
        languageTag,
      });
  }
}

interface SearchPageProps {
  basePath: string;
  languageTag: LanguageTag;
  resultsPerPage: number;
  searchEngineJson: SearchEngineJson;
}

function SearchPageImpl({
  basePath,
  languageTag,
  resultsPerPage,
  searchEngineJson,
}: SearchPageProps) {
  const searchParams = useSearchParams();
  const pageString = searchParams.get("page");
  let page = pageString ? parseInt(pageString) : 0;
  if (isNaN(page)) {
    page = 0;
  }
  const query = searchParams.get("query");

  const [error, setError] = useState<Error | null>(null);
  const [searchCount, setSearchCount] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<
    readonly SearchResult[] | null
  >(null);

  useEffect(() => {
    if (!query) {
      setError(new Error("Invalid query"));
      return;
    }

    const searchEngine = createSearchEngineFromJson(searchEngineJson);

    if (searchCount === null) {
      searchEngine
        .searchCount({ languageTag, query })
        .then(setSearchCount, setError);
    }

    searchEngine
      .search({
        languageTag,
        limit: resultsPerPage,
        offset: page * resultsPerPage,
        query,
      })
      .then(setSearchResults, setError);
  }, [
    languageTag,
    page,
    query,
    resultsPerPage,
    searchCount,
    searchEngineJson,
    searchParams,
  ]);

  if (error) {
    return (
      <>
        <PageTitleHeading>Error</PageTitleHeading>
        <p>{error.message}</p>
      </>
    );
  }

  const heading = (
    <PageTitleHeading>Search results for &quot;{query}&quot;</PageTitleHeading>
  );
  if (searchCount === null || searchResults === null) {
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
        {searchResults.map((searchResult, searchResultI) => (
          <li key={searchResultI}>
            {searchResult.type}:&nbsp;
            <Link
              href={searchResultHref({ basePath, languageTag, searchResult })}
            >
              <b>{searchResult.prefLabel}</b>
            </Link>
          </li>
        ))}
      </ul>
      <Pagination
        currentPage={page}
        itemsPerPage={resultsPerPage}
        itemsTotal={searchCount}
        pageHref={(page) =>
          PageHrefs.search({
            basePath,
            languageTag,
            page,
            query: query ?? undefined,
          })
        }
      />
    </>
  );
}

export function SearchPage(props: SearchPageProps) {
  // https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
  return (
    <Suspense>
      <SearchPageImpl {...props} />
    </Suspense>
  );
}
