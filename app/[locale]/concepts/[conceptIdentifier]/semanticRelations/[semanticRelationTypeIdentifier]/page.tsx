import { PageMetadata } from "@/app/PageMetadata";
import { configuration } from "@/app/configuration";
import { kosFactory } from "@/app/kosFactory";
import { ConceptList } from "@/lib/components/ConceptList";
import { Layout } from "@/lib/components/Layout";
import { PageTitleHeading } from "@/lib/components/PageTitleHeading";
import { dataFactory } from "@/lib/dataFactory";
import { Identifier, Locale } from "@/lib/models";
import { Concept } from "@kos-kit/models";
import { decodeFileName, encodeFileName } from "@kos-kit/next-utils";
import { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

interface ConceptSemanticRelationsPageParams {
  conceptIdentifier: string;
  locale: Locale;
  semanticRelationType: string;
}

export default async function ConceptSemanticRelationsPage({
  params: { conceptIdentifier, locale, semanticRelationType },
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
    semanticRelationPropertiesByName[semanticRelationType];

  const semanticRelations = await (
    await concept.semanticRelations(semanticRelationProperty)
  ).flatResolve();

  const translations = await getTranslations("ConceptSemanticRelationsPage");

  return (
    <Layout>
      <PageTitleHeading>
        {translations("concept")}: {concept.displayLabel}
      </PageTitleHeading>
      <ConceptList concepts={semanticRelations} />
    </Layout>
  );
}

export async function generateMetadata({
  params: {
    conceptIdentifier,
    locale,
    semanticRelationType: semanticRelationTypeString,
  },
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
      semanticRelationType: Concept.SemanticRelation.Types.find(
        (semanticRelationType) =>
          semanticRelationType.property.value === semanticRelationTypeString,
      )!,
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

      for (const semanticRelationType of Concept.SemanticRelation.Type) {
        if (
          (await concept.semanticRelations(semanticRelationType)).length <=
          configuration.relatedConceptsPerSection
        ) {
          continue;
        }

        staticParams.push({
          conceptIdentifier,
          locale,
          semanticRelationType: semanticRelationType.name,
        });
      }
    }
  }

  return staticParams;
}
