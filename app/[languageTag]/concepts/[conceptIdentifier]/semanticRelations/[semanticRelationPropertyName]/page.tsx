import { PageMetadata } from "@/app/PageMetadata";
import { configuration } from "@/app/configuration";
import { kosFactory } from "@/app/kosFactory";
import { ConceptList } from "@/lib/components/ConceptList";
import { Layout } from "@/lib/components/Layout";
import { PageTitleHeading } from "@/lib/components/PageTitleHeading";
import { dataFactory } from "@/lib/dataFactory";
import {
  Identifier,
  LanguageTag,
  SemanticRelationProperty,
  semanticRelationProperties,
} from "@/lib/models";
import { decodeFileName, encodeFileName } from "@kos-kit/next-utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface ConceptSemanticRelationsPageParams {
  conceptIdentifier: string;
  languageTag: LanguageTag;
  semanticRelationPropertyName: string;
}

const semanticRelationPropertiesByName = semanticRelationProperties.reduce(
  (semanticRelationPropertiesByName, semanticRelationProperty) => {
    semanticRelationPropertiesByName[semanticRelationProperty.name] =
      semanticRelationProperty;
    return semanticRelationPropertiesByName;
  },
  {} as Record<string, SemanticRelationProperty>,
);

export default async function ConceptSemanticRelationsPage({
  params: { conceptIdentifier, languageTag, semanticRelationPropertyName },
}: {
  params: ConceptSemanticRelationsPageParams;
}) {
  const concept = (
    await (
      await kosFactory({ languageTag })
    )
      .concept(
        Identifier.fromString({
          dataFactory,
          identifier: decodeFileName(conceptIdentifier),
        }),
      )
      .resolve()
  )
    .toMaybe()
    .extractNullable();
  if (!concept) {
    notFound();
  }

  const semanticRelationProperty =
    semanticRelationPropertiesByName[semanticRelationPropertyName];

  const semanticRelations = await (
    await concept.semanticRelations(semanticRelationProperty)
  ).flatResolve();

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
  const concept = (
    await (
      await kosFactory({ languageTag })
    )
      .concept(
        Identifier.fromString({
          dataFactory,
          identifier: decodeFileName(conceptIdentifier),
        }),
      )
      .resolve()
  )
    .toMaybe()
    .extractNullable();
  if (!concept) {
    return {};
  }
  return (
    (await new PageMetadata({
      languageTag,
    }).conceptSemanticRelations({
      concept,
      semanticRelationProperty:
        semanticRelationPropertiesByName[semanticRelationPropertyName],
    })) ?? {}
  );
}

export async function generateStaticParams(): Promise<
  ConceptSemanticRelationsPageParams[]
> {
  if (configuration.dynamic) {
    return [];
  }

  const staticParams: ConceptSemanticRelationsPageParams[] = [];

  for (const languageTag of configuration.languageTags) {
    for await (const concept of await (
      await (
        await kosFactory({ languageTag })
      ).concepts({ limit: null, offset: 0, query: { type: "All" } })
    ).flatResolve()) {
      const conceptIdentifier = encodeFileName(
        Identifier.toString(concept.identifier),
      );

      for (const semanticRelationProperty of semanticRelationProperties) {
        if (
          (await concept.semanticRelations(semanticRelationProperty)).length <=
          configuration.relatedConceptsPerSection
        ) {
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
