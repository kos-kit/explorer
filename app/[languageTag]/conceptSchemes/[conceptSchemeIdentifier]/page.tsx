import { PageMetadata } from "@/app/PageMetadata";
import modelSet from "@/app/modelSet";
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

export default async function ConceptSchemePage({
  params: { conceptSchemeIdentifier, languageTag },
}: {
  params: ConceptSchemePageParams;
}) {
  const conceptScheme = await modelSet.conceptSchemeByIdentifier(
    stringToIdentifier(defilenamify(conceptSchemeIdentifier)),
  );

  return (
    <ConceptSchemePageComponent
      conceptScheme={conceptScheme}
      languageTag={languageTag}
    />
  );
}

export async function generateMetadata({
  params: { conceptSchemeIdentifier, languageTag },
}: {
  params: ConceptSchemePageParams;
}): Promise<Metadata> {
  return PageMetadata.conceptScheme({
    conceptScheme: await modelSet.conceptSchemeByIdentifier(
      stringToIdentifier(defilenamify(conceptSchemeIdentifier)),
    ),
    languageTag,
  });
}

export async function generateStaticParams(): Promise<
  ConceptSchemePageParams[]
> {
  const staticParams: ConceptSchemePageParams[] = [];

  const languageTags = await modelSet.languageTags();
  // If there's only one concept scheme the /[languageTag]/ page will show its ConceptPage,
  // but we still have to generate another ConceptPage here because Next doesn't like an empty staticParams.
  for (const conceptScheme of await modelSet.conceptSchemes()) {
    for (const languageTag of languageTags) {
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
