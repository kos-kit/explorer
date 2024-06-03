import { PageMetadata } from "@/app/PageMetadata";
import configuration from "@/app/configuration";
import kosFactory from "@/app/kosFactory";
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
  const conceptScheme = await kosFactory({
    languageTag,
  }).conceptSchemeByIdentifier(
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
  return new PageMetadata({ languageTag }).conceptScheme(
    await kosFactory({ languageTag }).conceptSchemeByIdentifier(
      stringToIdentifier(defilenamify(conceptSchemeIdentifier)),
    ),
  );
}

export async function generateStaticParams(): Promise<
  ConceptSchemePageParams[]
> {
  if (configuration.dynamic) {
    return [];
  }

  const staticParams: ConceptSchemePageParams[] = [];

  // If there's only one concept scheme the /[languageTag]/ page will show its ConceptPage,
  // but we still have to generate another ConceptPage here because Next doesn't like an empty staticParams.
  for (const languageTag of configuration.languageTags) {
    for (const conceptScheme of await kosFactory({
      languageTag,
    }).conceptSchemes()) {
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
