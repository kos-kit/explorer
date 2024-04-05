import configuration from "@/app/configuration";
import modelSet from "@/app/modelSet";
import { Pages } from "@/app/Pages";
import { ConceptList } from "@/lib/components/ConceptList";
import { Layout } from "@/lib/components/Layout";
import { Concept } from "@/lib/models/Concept";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { MappingProperty } from "@/lib/models/MappingProperty";
import { SemanticRelationProperty } from "@/lib/models/SemanticRelationProperty";
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

  const mappingProperty = MappingProperty.byName(semanticRelationPropertyName);
  const semanticRelationProperty = SemanticRelationProperty.byName(
    semanticRelationPropertyName,
  );
  let semanticRelations: readonly Concept[];
  if (mappingProperty !== null) {
    semanticRelations = concept.mappingRelations(mappingProperty);
  } else if (semanticRelationProperty !== null) {
    semanticRelations = concept.semanticRelations(semanticRelationProperty);
  } else {
    throw new RangeError();
  }

  return (
    <Layout
      languageTag={languageTag}
      title={`Concept: ${
        concept.prefLabel(languageTag)?.literalForm.value ??
        identifierToString(concept.identifier)
      }: ${semanticRelationPropertyName} concepts`}
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
      MappingProperty.byName(semanticRelationPropertyName) ??
      SemanticRelationProperty.byName(semanticRelationPropertyName)!,
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

      const semanticRelationCounts: { [index: string]: number } = {};
      for (const mappingProperty of MappingProperty.values) {
        semanticRelationCounts[mappingProperty.name] =
          concept.mappingRelationsCount(mappingProperty);
      }
      for (const semanticRelationProperty of SemanticRelationProperty.values) {
        semanticRelationCounts[semanticRelationProperty.name] =
          concept.semanticRelationsCount(semanticRelationProperty);
      }

      for (const semanticRelationPropertyName of Object.keys(
        semanticRelationCounts,
      )) {
        const semanticRelationCount =
          semanticRelationCounts[semanticRelationPropertyName];
        if (semanticRelationCount <= configuration.relatedConceptsPerSection) {
          continue;
        }

        for (const languageTag of modelSet.languageTags) {
          staticParams.push({
            conceptIdentifier,
            languageTag,
            semanticRelationPropertyName,
          });
        }
      }

      conceptsOffset++;
    }
  }

  return staticParams;
}
