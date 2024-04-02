import modelSet from "@/app/modelSet";
import Pages from "@/lib/Pages";
import { ConceptList } from "@/lib/components/ConceptList";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { defilenamify } from "@/lib/utilities/defilenamify";
import { filenamify } from "@/lib/utilities/filenamify";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { stringToIdentifier } from "@/lib/utilities/stringToIdentifier";
import { Metadata } from "next";

interface ConceptSchemePageParams {
  conceptSchemeIdentifier: string;
  languageTag: LanguageTag;
}

export default function ConceptSchemePage({
  params: { conceptSchemeIdentifier, languageTag },
}: {
  params: ConceptSchemePageParams;
}) {
  const conceptScheme = modelSet.conceptSchemeByIdentifier(
    stringToIdentifier(defilenamify(conceptSchemeIdentifier)),
  );

  const prefLabel =
    conceptScheme.prefLabel(languageTag)?.literalForm.value ??
    identifierToString(conceptScheme.identifier);

  const topConceptsCount = conceptScheme.topConceptsCount;

  return (
    <div className="flex flex-col gap-8">
      <h1>Concept Scheme: {prefLabel}</h1>
      {topConceptsCount > 0 ? (
        <section>
          <h2>Top concepts</h2>
          <ConceptList
            concepts={[...conceptScheme.topConcepts({ limit: 10, offset: 0 })]}
            languageTag={languageTag}
          />
        </section>
      ) : null}
    </div>
  );
}

export function generateMetadata({
  params: { conceptSchemeIdentifier, languageTag },
}: {
  params: ConceptSchemePageParams;
}): Metadata {
  const conceptScheme = modelSet.conceptSchemeByIdentifier(
    stringToIdentifier(defilenamify(conceptSchemeIdentifier)),
  );

  return Pages.conceptScheme({ conceptScheme, languageTag }).metadata;
}

export function generateStaticParams(): ConceptSchemePageParams[] {
  const staticParams: ConceptSchemePageParams[] = [];
  for (const conceptScheme of modelSet.conceptSchemes) {
    for (const languageTag of modelSet.languageTags) {
      staticParams.push({
        conceptSchemeIdentifier: filenamify(
          identifierToString(conceptScheme.identifier),
        ),
        languageTag,
      });
    }
  }
  return staticParams;
}
