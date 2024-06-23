import { PageMetadata } from "@/app/PageMetadata";
import configuration from "@/app/configuration";
import { ConceptList } from "@/lib/components/ConceptList";
import { Layout } from "@/lib/components/Layout";
import { PageTitleHeading } from "@/lib/components/PageTitleHeading";
import { defilenamify, filenamify } from "@kos-kit/next-utils";
import {
  LanguageTag,
  semanticRelationProperties,
  semanticRelationPropertiesByName,
} from "@kos-kit/models";
import { Metadata } from "next";
import kosFactory from "../../../../../kosFactory";
import { Resource } from "@kos-kit/rdf-resource";

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
  const concept = await (
    await kosFactory({ languageTag })
  ).conceptByIdentifier(
    Resource.Identifier.fromString(defilenamify(conceptIdentifier)),
  );

  const semanticRelationProperty =
    semanticRelationPropertiesByName[semanticRelationPropertyName]!;

  const semanticRelations = await concept.semanticRelations(
    semanticRelationProperty,
  );

  return (
    <Layout languageTag={languageTag}>
      <PageTitleHeading>Concept: {concept.displayLabel}</PageTitleHeading>
      <ConceptList concepts={semanticRelations} languageTag={languageTag} />
    </Layout>
  );
}

export async function generateMetadata({
  params: { conceptIdentifier, languageTag, semanticRelationPropertyName },
}: {
  params: ConceptSemanticRelationsPageParams;
}): Promise<Metadata> {
  return new PageMetadata({ languageTag }).conceptSemanticRelations({
    concept: await (
      await kosFactory({ languageTag })
    ).conceptByIdentifier(
      Resource.Identifier.fromString(defilenamify(conceptIdentifier)),
    ),
    semanticRelationProperty:
      semanticRelationPropertiesByName[semanticRelationPropertyName]!,
  });
}

export async function generateStaticParams(): Promise<
  ConceptSemanticRelationsPageParams[]
> {
  if (configuration.dynamic) {
    return [];
  }

  const staticParams: ConceptSemanticRelationsPageParams[] = [];

  for (const languageTag of configuration.languageTags) {
    for await (const concept of (
      await kosFactory({ languageTag })
    ).concepts()) {
      const conceptIdentifier = filenamify(
        Resource.Identifier.toString(concept.identifier),
      );

      for (const semanticRelationProperty of semanticRelationProperties) {
        const semanticRelationCount = await concept.semanticRelationsCount(
          semanticRelationProperty,
        );
        if (semanticRelationCount <= configuration.relatedConceptsPerSection) {
          continue;
        }

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
