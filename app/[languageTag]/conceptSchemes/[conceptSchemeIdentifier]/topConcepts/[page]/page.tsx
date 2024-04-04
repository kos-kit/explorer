import configuration from "@/app/configuration";
import modelSet from "@/app/modelSet";
import { Pages } from "@/lib/Pages";
import { ConceptList } from "@/lib/components/ConceptList";
import { Pagination } from "@/lib/components/Pagination";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { defilenamify } from "@/lib/utilities/defilenamify";
import { filenamify } from "@/lib/utilities/filenamify";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { pageCount } from "@/lib/utilities/pageCount";
import { stringToIdentifier } from "@/lib/utilities/stringToIdentifier";
import { Metadata } from "next";

interface ConceptSchemeTopConceptsPageParams {
  conceptSchemeIdentifier: string;
  languageTag: LanguageTag;
  page: string;
}

export default function ConceptSchemeTopConceptsPage({
  params: { conceptSchemeIdentifier, languageTag, page },
}: {
  params: ConceptSchemeTopConceptsPageParams;
}) {
  const conceptScheme = modelSet.conceptSchemeByIdentifier(
    stringToIdentifier(defilenamify(conceptSchemeIdentifier)),
  );

  const pageInt = parseInt(page);

  const prefLabel =
    conceptScheme.prefLabel(languageTag)?.literalForm.value ??
    identifierToString(conceptScheme.identifier);

  const topConceptsCount = conceptScheme.topConceptsCount;

  return (
    <div className="flex flex-col gap-8">
      <h1>Concept Scheme: {prefLabel}</h1>
      <h2>
        Top concepts (Page {pageInt + 1} of{" "}
        {pageCount({
          itemsPerPage: configuration.conceptsPerPage,
          itemsTotal: topConceptsCount,
        })}
        )
      </h2>
      <div className="flex flex-col gap-2">
        <ConceptList
          concepts={[
            ...conceptScheme.topConcepts({
              limit: configuration.conceptsPerPage,
              offset: parseInt(page) * configuration.conceptsPerPage,
            }),
          ]}
          languageTag={languageTag}
        />
      </div>
      <Pagination
        currentPage={pageInt}
        itemsPerPage={configuration.conceptsPerPage}
        itemsTotal={topConceptsCount}
        pageHref={(page) =>
          Pages.conceptSchemeTopConcepts({ conceptScheme, languageTag, page })
            .href
        }
      />
    </div>
  );
}

export function generateMetadata({
  params: { conceptSchemeIdentifier, languageTag, page },
}: {
  params: ConceptSchemeTopConceptsPageParams;
}): Metadata {
  const conceptScheme = modelSet.conceptSchemeByIdentifier(
    stringToIdentifier(defilenamify(conceptSchemeIdentifier)),
  );

  return Pages.conceptSchemeTopConcepts({
    conceptScheme,
    languageTag,
    page: parseInt(page),
  }).metadata;
}

export function generateStaticParams(): ConceptSchemeTopConceptsPageParams[] {
  const staticParams: ConceptSchemeTopConceptsPageParams[] = [];

  for (const conceptScheme of modelSet.conceptSchemes) {
    const topConceptsCount = conceptScheme.topConceptsCount;
    if (topConceptsCount <= configuration.relatedConceptsPerSection) {
      // Top concepts will fit on the concept scheme page, no need for this page.
      continue;
    }
    const pageCount_ = pageCount({
      itemsPerPage: configuration.conceptsPerPage,
      itemsTotal: topConceptsCount,
    });
    // Top concepts will spill over from the concept scheme page to this one.
    for (const languageTag of modelSet.languageTags) {
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
