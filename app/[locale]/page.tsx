import { PageMetadata } from "@/app/PageMetadata";
import { configuration } from "@/app/configuration";
import { ConceptSchemePage } from "@/lib/components/ConceptSchemePage";
import { Locale } from "@/lib/models";
import { Metadata } from "next";
import { unstable_setRequestLocale } from "next-intl/server";
import { kosFactory } from "../kosFactory";

interface LocalePageParams {
  locale: Locale;
}

export default async function LocalePage({
  params: { locale },
}: {
  params: LocalePageParams;
}) {
  unstable_setRequestLocale(locale);

  const conceptSchemes = await (
    await (
      await kosFactory({
        locale,
      })
    ).conceptSchemes({ limit: null, offset: 0, query: { type: "All" } })
  ).flatResolve();
  if (conceptSchemes.length === 1) {
    return <ConceptSchemePage conceptScheme={conceptSchemes[0]} />;
  }
  throw new RangeError(
    `TODO: generate concept scheme links for ${conceptSchemes.length} concept schemes`,
  );
}

export function generateMetadata({
  params: { locale },
}: {
  params: LocalePageParams;
}): Promise<Metadata> {
  return new PageMetadata({ locale }).locale();
}

export function generateStaticParams(): LocalePageParams[] {
  if (configuration.dynamic) {
    return [];
  }

  return configuration.locales.map((locale) => ({
    locale,
  }));
}
