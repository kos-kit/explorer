import { PageMetadata } from "@/app/PageMetadata";
import configuration from "@/app/configuration";
import kos from "@/app/kos";
import { ConceptList } from "@/lib/components/ConceptList";
import { Layout } from "@/lib/components/Layout";
import { PageTitleHeading } from "@/lib/components/PageTitleHeading";
import { defilenamify } from "@/lib/utilities/defilenamify";
import { displayLabel } from "@/lib/utilities/displayLabel";
import { filenamify } from "@/lib/utilities/filenamify";
import {
  LanguageTag,
  semanticRelationProperties,
  semanticRelationPropertiesByName,
} from "@kos-kit/client/models";
import {
  identifierToString,
  stringToIdentifier,
} from "@kos-kit/client/utilities";
import { Metadata } from "next";

interface ConceptSemanticRelationsPageParams {
  conceptIdentifier: string;
  languageTag: LanguageTag;
  semanticRelationPropertyName: string;
}

export default async function ConceptSemanticRelationsPage({
  params: { conceptIdentifier, languageTag, semanticRelationPropertyName },
}: {
  params: ConceptSemanticRelationsPageParams;
}) {
  const concept = await kos.conceptByIdentifier(
    stringToIdentifier(defilenamify(conceptIdentifier)),
  );

  const semanticRelationProperty =
    semanticRelationPropertiesByName[semanticRelationPropertyName]!;

  const semanticRelations = await concept.semanticRelations(
    semanticRelationProperty,
  );

  return (
    <Layout languageTag={languageTag}>
      <PageTitleHeading>
        Concept: {await displayLabel({ languageTag, model: concept })}
      </PageTitleHeading>
      <ConceptList concepts={semanticRelations} languageTag={languageTag} />
    </Layout>
  );
}

export async function generateMetadata({
  params: { conceptIdentifier, languageTag, semanticRelationPropertyName },
}: {
  params: ConceptSemanticRelationsPageParams;
}): Promise<Metadata> {
  return PageMetadata.conceptSemanticRelations({
    concept: await kos.conceptByIdentifier(
      stringToIdentifier(defilenamify(conceptIdentifier)),
    ),
    languageTag,
    semanticRelationProperty:
      semanticRelationPropertiesByName[semanticRelationPropertyName]!,
  });
}

export async function generateStaticParams(): Promise<
  ConceptSemanticRelationsPageParams[]
> {
  const staticParams: ConceptSemanticRelationsPageParams[] = [];

  const languageTags = await kos.languageTags();
  for await (const concept of kos.concepts()) {
    const conceptIdentifier = filenamify(
      identifierToString(concept.identifier),
    );

    for (const semanticRelationProperty of semanticRelationProperties) {
      const semanticRelationCount = await concept.semanticRelationsCount(
        semanticRelationProperty,
      );
      if (semanticRelationCount <= configuration.relatedConceptsPerSection) {
        continue;
      }

      for (const languageTag of languageTags) {
        staticParams.push({
          conceptIdentifier,
          languageTag,
          semanticRelationPropertyName: semanticRelationProperty.name,
        });
      }
    }
  }

  return staticParams;
}
