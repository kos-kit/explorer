import { PageMetadata } from "@/app/PageMetadata";
import configuration from "@/app/configuration";
import modelSet from "@/app/modelSet";
import { ConceptList } from "@/lib/components/ConceptList";
import { Layout } from "@/lib/components/Layout";
import { LanguageTag } from "@/lib/models/LanguageTag";
import {
  semanticRelationProperties,
  semanticRelationPropertiesByName,
} from "@/lib/models/semanticRelationProperties";
import { defilenamify } from "@/lib/utilities/defilenamify";
import { displayLabel } from "@/lib/utilities/displayLabel";
import { filenamify } from "@/lib/utilities/filenamify";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { stringToIdentifier } from "@/lib/utilities/stringToIdentifier";
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
  const concept = await modelSet.conceptByIdentifier(
    stringToIdentifier(defilenamify(conceptIdentifier)),
  );

  const semanticRelationProperty =
    semanticRelationPropertiesByName[semanticRelationPropertyName]!;

  const semanticRelations = await concept.semanticRelations(
    semanticRelationProperty,
  );

  return (
    <Layout
      languageTag={languageTag}
      title={`Concept: ${await displayLabel({ languageTag, model: concept })}: ${semanticRelationProperty.label} concepts`}
    >
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
    concept: await modelSet.conceptByIdentifier(
      stringToIdentifier(defilenamify(conceptIdentifier)),
    ),
    languageTag,
    semanticRelationProperty:
      semanticRelationPropertiesByName[semanticRelationPropertyName],
  });
}

export async function generateStaticParams(): Promise<
  ConceptSemanticRelationsPageParams[]
> {
  const staticParams: ConceptSemanticRelationsPageParams[] = [];

  const conceptsCount = await modelSet.conceptsCount();
  const conceptsLimit = 100;
  let conceptsOffset = 0;
  const languageTags = await modelSet.languageTags();
  while (conceptsOffset < conceptsCount) {
    for (const concept of await modelSet.concepts({
      limit: conceptsLimit,
      offset: conceptsOffset,
    })) {
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

      conceptsOffset++;
    }
  }

  return staticParams;
}
