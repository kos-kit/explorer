import { PageMetadata } from "@/app/PageMetadata";
import configuration from "@/app/configuration";
import kosFactory from "@/app/kosFactory";
import { ConceptSchemePage as ConceptSchemePageComponent } from "@/lib/components/ConceptSchemePage";
import { defilenamify, filenamify } from "@kos-kit/next-utils";
import { LanguageTag } from "@kos-kit/models";
import { Metadata } from "next";
import { Resource } from "@kos-kit/rdf-resource";
import { notFound } from "next/navigation";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";

interface ConceptSchemePageParams {
  conceptSchemeIdentifier: string;
  languageTag: LanguageTag;
}

export default async function ConceptSchemePage({
  params: { conceptSchemeIdentifier, languageTag },
}: {
  params: ConceptSchemePageParams;
}) {
  const conceptScheme = O.toNullable(
    await (
      await kosFactory({
        languageTag,
      })
    ).conceptSchemeByIdentifier(
      Resource.Identifier.fromString(defilenamify(conceptSchemeIdentifier)),
    ),
  );
  if (!conceptScheme) {
    notFound();
  }

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
  return pipe(
    await (
      await kosFactory({ languageTag })
    ).conceptSchemeByIdentifier(
      Resource.Identifier.fromString(defilenamify(conceptSchemeIdentifier)),
    ),
    O.map((conceptScheme) =>
      new PageMetadata({ languageTag }).conceptScheme(conceptScheme),
    ),
    O.getOrElse(() => ({})),
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
    for (const conceptScheme of await (
      await kosFactory({
        languageTag,
      })
    ).conceptSchemes()) {
      staticParams.push({
        conceptSchemeIdentifier: filenamify(
          Resource.Identifier.toString(conceptScheme.identifier),
        ),
        languageTag,
      });
    }
  }

  return staticParams;
}
