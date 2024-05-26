import configuration from "@/app/configuration";
import kos from "@/app/kos";
import { ConceptSchemePage } from "@/lib/components/ConceptSchemePage";
import { Metadata } from "next";
import { PageMetadata } from "../PageMetadata";
import { LanguageTag } from "@kos-kit/client/models";

interface LanguageTagPageParams {
  languageTag: LanguageTag;
}

export default async function LanguageTagPage() {
  const conceptSchemes = await kos.conceptSchemes();
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

export async function generateMetadata({
  params: { languageTag },
}: {
  params: LanguageTagPageParams;
}): Promise<Metadata> {
  return PageMetadata.languageTag({
    languageTag,
  });
}

export async function generateStaticParams(): Promise<LanguageTagPageParams[]> {
  return (await kos.languageTags()).map((languageTag) => ({
    languageTag,
  }));
}
