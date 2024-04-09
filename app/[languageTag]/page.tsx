import configuration from "@/app/configuration";
import modelSet from "@/app/modelSet";
import { ConceptSchemePage } from "@/lib/components/ConceptSchemePage";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { Metadata } from "next";
import { PageMetadata } from "../PageMetadata";

interface LanguageTagPageParams {
  languageTag: LanguageTag;
}

export default async function LanguageTagPage() {
  const conceptSchemes = await modelSet.conceptSchemes();
  if (conceptSchemes.length === 1) {
    return (
      <ConceptSchemePage
        conceptScheme={conceptSchemes[0]}
        languageTag={configuration.defaultLanguageTag}
      />
    );
  }
  throw new RangeError("# of concept schemes: " + conceptSchemes.length);
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
  return (await modelSet.languageTags()).map((languageTag) => ({
    languageTag,
  }));
}
