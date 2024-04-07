import modelSet from "@/app/modelSet";
import { Pages } from "@/app/PageHrefs";
import { ConceptSchemePage as ConceptSchemePageComponent } from "@/lib/components/ConceptSchemePage";
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

  return (
    <ConceptSchemePageComponent
      conceptScheme={conceptScheme}
      languageTag={languageTag}
    />
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

  const conceptSchemes = modelSet.conceptSchemes;
  if (conceptSchemes.length > 1) {
    for (const conceptScheme of conceptSchemes) {
      for (const languageTag of modelSet.languageTags) {
        staticParams.push({
          conceptSchemeIdentifier: filenamify(
            identifierToString(conceptScheme.identifier),
          ),
          languageTag,
        });
      }
    }
  } // Else the root page will be the concept scheme

  return staticParams;
}
