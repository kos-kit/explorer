import { PageMetadata } from "@/app/PageMetadata";
import { configuration } from "@/app/configuration";
import { kosFactory } from "@/app/kosFactory";
import { ConceptSchemePage as ConceptSchemePageComponent } from "@/lib/components/ConceptSchemePage";
import { dataFactory } from "@/lib/dataFactory";
import { Identifier, Locale } from "@/lib/models";
import { decodeFileName, encodeFileName } from "@kos-kit/next-utils";
import { Metadata } from "next";
import { unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

interface ConceptSchemePageParams {
  conceptSchemeIdentifier: string;
  locale: Locale;
}

export default async function ConceptSchemePage({
  params: { conceptSchemeIdentifier, locale },
}: {
  params: ConceptSchemePageParams;
}) {
  const kos = await kosFactory({
    locale,
  });

  const conceptScheme = (
    await kos.conceptScheme(
      Identifier.fromString({
        dataFactory,
        identifier: decodeFileName(conceptSchemeIdentifier),
      }),
    )
  )
    .toMaybe()
    .extractNullable();
  if (!conceptScheme) {
    notFound();
  }

  return <ConceptSchemePageComponent conceptScheme={conceptScheme} kos={kos} />;
}

export async function generateMetadata({
  params: { conceptSchemeIdentifier, locale },
}: {
  params: ConceptSchemePageParams;
}): Promise<Metadata> {
  unstable_setRequestLocale(locale);

  const conceptScheme = (
    await (
      await kosFactory({ locale })
    ).conceptSchemeStub(
      Identifier.fromString({
        dataFactory,
        identifier: decodeFileName(conceptSchemeIdentifier),
      }),
    )
  )
    .toMaybe()
    .extractNullable();
  if (!conceptScheme) {
    return {};
  }
  return (
    (await new PageMetadata({ locale }).conceptScheme(conceptScheme)) ?? {}
  );
}

export async function generateStaticParams(): Promise<
  ConceptSchemePageParams[]
> {
  if (configuration.dynamic) {
    return [];
  }

  const staticParams: ConceptSchemePageParams[] = [];

  // If there's only one concept scheme the /[locale]/ page will show its ConceptPage,
  // but we still have to generate another ConceptPage here because Next doesn't like an empty staticParams.
  for (const locale of configuration.locales) {
    for (const conceptSchemeIdentifier of await (
      await kosFactory({
        locale,
      })
    ).conceptSchemeIdentifiers({
      limit: null,
      offset: 0,
      query: { type: "All" },
    })) {
      staticParams.push({
        conceptSchemeIdentifier: encodeFileName(
          Identifier.toString(conceptSchemeIdentifier),
        ),
        locale,
      });
    }
  }

  return staticParams;
}
