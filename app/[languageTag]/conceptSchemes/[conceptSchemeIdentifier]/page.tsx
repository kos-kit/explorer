import { PageMetadata } from "@/app/PageMetadata";
import configuration from "@/app/configuration";
import kos from "@/app/kos";
import { ConceptSchemePage as ConceptSchemePageComponent } from "@/lib/components/ConceptSchemePage";
import { defilenamify, filenamify } from "@kos-kit/client/utilities";
import { LanguageTag } from "@kos-kit/client/models";
import {
  identifierToString,
  stringToIdentifier,
} from "@kos-kit/client/utilities";
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
  const conceptScheme = await kos.conceptSchemeByIdentifier(
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
    conceptScheme: await kos.conceptSchemeByIdentifier(
      stringToIdentifier(defilenamify(conceptSchemeIdentifier)),
    ),
    languageTag,
  });
}

export async function generateStaticParams(): Promise<
  ConceptSchemePageParams[]
> {
  if (configuration.dynamic) {
    return [];
  }

  const staticParams: ConceptSchemePageParams[] = [];

  const languageTags = await kos.languageTags();
  // If there's only one concept scheme the /[languageTag]/ page will show its ConceptPage,
  // but we still have to generate another ConceptPage here because Next doesn't like an empty staticParams.
  for (const conceptScheme of await kos.conceptSchemes()) {
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
