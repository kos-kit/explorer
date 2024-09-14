import { PageMetadata } from "@/app/PageMetadata";
import { configuration } from "@/app/configuration";
import { kosFactory } from "@/app/kosFactory";
import { ConceptSchemePage as ConceptSchemePageComponent } from "@/lib/components/ConceptSchemePage";
import { dataFactory } from "@/lib/dataFactory";
import { Identifier, LanguageTag } from "@/lib/models";
import { decodeFileName, encodeFileName } from "@kos-kit/next-utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface ConceptSchemePageParams {
  conceptSchemeIdentifier: string;
  languageTag: LanguageTag;
}

export default async function ConceptSchemePage({
  params: { conceptSchemeIdentifier, languageTag },
}: {
  params: ConceptSchemePageParams;
}) {
  const conceptScheme = (
    await (
      await kosFactory({
        languageTag,
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
  const conceptScheme = (
    await (
      await kosFactory({ languageTag })
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
    (await new PageMetadata({ languageTag }).conceptScheme(conceptScheme)) ?? {}
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
    ).conceptSchemes({ limit: null, offset: 0, query: { type: "All" } })) {
      staticParams.push({
        conceptSchemeIdentifier: encodeFileName(
          Identifier.toString(conceptScheme.identifier),
        ),
        languageTag,
      });
    }
  }

  return staticParams;
}
