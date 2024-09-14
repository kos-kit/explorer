import { PageMetadata } from "@/app/PageMetadata";
import { configuration } from "@/app/configuration";
import { kosFactory } from "@/app/kosFactory";
import { ConceptList } from "@/lib/components/ConceptList";
import { Layout } from "@/lib/components/Layout";
import { PageTitleHeading } from "@/lib/components/PageTitleHeading";
import { dataFactory } from "@/lib/dataFactory";
import {
  Identifier,
  Locale,
  SemanticRelationProperty,
  semanticRelationProperties,
} from "@/lib/models";
import { decodeFileName, encodeFileName } from "@kos-kit/next-utils";
import { Metadata } from "next";
import { unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

interface ConceptSemanticRelationsPageParams {
  conceptIdentifier: string;
  locale: Locale;
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
  params: { conceptIdentifier, locale, semanticRelationPropertyName },
}: {
  params: ConceptSemanticRelationsPageParams;
}) {
  unstable_setRequestLocale(locale);

  const concept = (
    await (
      await kosFactory({ locale })
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
    <Layout>
      <PageTitleHeading>Concept: {concept.displayLabel}</PageTitleHeading>
      <ConceptList concepts={semanticRelations} />
    </Layout>
  );
}

export async function generateMetadata({
  params: { conceptIdentifier, locale, semanticRelationPropertyName },
}: {
  params: ConceptSemanticRelationsPageParams;
}): Promise<Metadata> {
  const concept = (
    await (
      await kosFactory({ locale })
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
      locale,
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

  for (const locale of configuration.locales) {
    for await (const concept of await (
      await (
        await kosFactory({ locale })
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
          locale,
          semanticRelationPropertyName: semanticRelationProperty.name,
        });
      }
    }
  }

  return staticParams;
}
