import { PageMetadata } from "@/app/PageMetadata";
import { configuration } from "@/app/configuration";
import { ConceptSchemePage } from "@/lib/components/ConceptSchemePage";
import { LanguageTag } from "@/lib/models";
import { Metadata } from "next";
import { kosFactory } from "../kosFactory";

interface LanguageTagPageParams {
  languageTag: LanguageTag;
}

export default async function LanguageTagPage() {
  const conceptSchemes = await (
    await (
      await kosFactory({
        languageTag: configuration.defaultLanguageTag,
      })
    ).conceptSchemes({ limit: null, offset: 0, query: { type: "All" } })
  ).flatResolve();
  if (conceptSchemes.length === 1) {
    return (
      <ConceptSchemePage
        conceptScheme={conceptSchemes[0]}
        languageTag={configuration.defaultLanguageTag}
      />
    );
  }
  throw new RangeError(
    `TODO: generate concept scheme links for ${conceptSchemes.length} concept schemes`,
  );
}

export function generateMetadata({
  params: { languageTag },
}: {
  params: LanguageTagPageParams;
}): Promise<Metadata> {
  return new PageMetadata({ languageTag }).languageTag();
}

export function generateStaticParams(): LanguageTagPageParams[] {
  if (configuration.dynamic) {
    return [];
  }

  return configuration.languageTags.map((languageTag) => ({
    languageTag,
  }));
}
