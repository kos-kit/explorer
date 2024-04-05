import configuration from "@/app/configuration";
import modelSet from "@/app/modelSet";
import { Pages } from "@/app/Pages";
import { ConceptList } from "@/lib/components/ConceptList";
import { Layout } from "@/lib/components/Layout";
import { LanguageTag } from "@/lib/models/LanguageTag";
import {
  semanticRelationProperties,
  semanticRelationPropertiesByName,
} from "@/lib/models/semanticRelationProperties";
import { defilenamify } from "@/lib/utilities/defilenamify";
import { filenamify } from "@/lib/utilities/filenamify";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { stringToIdentifier } from "@/lib/utilities/stringToIdentifier";
import { Metadata } from "next";

interface ConceptSemanticRelationsPageParams {
  conceptIdentifier: string;
  languageTag: LanguageTag;
  semanticRelationPropertyName: string;
}

export default function ConceptSemanticRelationsPage({
  params: { conceptIdentifier, languageTag, semanticRelationPropertyName },
}: {
  params: ConceptSemanticRelationsPageParams;
}) {
  const concept = modelSet.conceptByIdentifier(
    stringToIdentifier(defilenamify(conceptIdentifier)),
  );

  const semanticRelationProperty =
    semanticRelationPropertiesByName[semanticRelationPropertyName]!;

  const semanticRelations = concept.semanticRelations(semanticRelationProperty);

  return (
    <Layout
      languageTag={languageTag}
      title={`Concept: ${
        concept.prefLabel(languageTag)?.literalForm.value ??
        identifierToString(concept.identifier)
      }: ${semanticRelationProperty.label} concepts`}
    >
      <ConceptList concepts={semanticRelations} languageTag={languageTag} />
    </Layout>
  );
}

export function generateMetadata({
  params: { conceptIdentifier, languageTag, semanticRelationPropertyName },
}: {
  params: ConceptSemanticRelationsPageParams;
}): Metadata {
  const concept = modelSet.conceptByIdentifier(
    stringToIdentifier(defilenamify(conceptIdentifier)),
  );

  return Pages.conceptSemanticRelations({
    concept,
    languageTag,
    semanticRelationProperty:
      semanticRelationPropertiesByName[semanticRelationPropertyName],
  }).metadata;
}

export function generateStaticParams(): ConceptSemanticRelationsPageParams[] {
  const staticParams: ConceptSemanticRelationsPageParams[] = [];

  const conceptsCount = modelSet.conceptsCount;
  const conceptsLimit = 100;
  let conceptsOffset = 0;
  while (conceptsOffset < conceptsCount) {
    for (const concept of modelSet.concepts({
      limit: conceptsLimit,
      offset: conceptsOffset,
    })) {
      const conceptIdentifier = filenamify(
        identifierToString(concept.identifier),
      );

      for (const semanticRelationProperty of semanticRelationProperties) {
        const semanticRelationCount = concept.semanticRelationsCount(
          semanticRelationProperty,
        );
        if (semanticRelationCount <= configuration.relatedConceptsPerSection) {
          continue;
        }

        for (const languageTag of modelSet.languageTags) {
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
