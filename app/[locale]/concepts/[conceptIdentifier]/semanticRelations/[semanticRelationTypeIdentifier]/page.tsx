import { PageMetadata } from "@/app/PageMetadata";
import { configuration } from "@/app/configuration";
import { kosFactory } from "@/app/kosFactory";
import { ConceptList } from "@/lib/components/ConceptList";
import { Layout } from "@/lib/components/Layout";
import { PageTitleHeading } from "@/lib/components/PageTitleHeading";
import { Section } from "@/lib/components/Section";
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
  semanticRelationTypeIdentifier: string;
}

export default async function ConceptSemanticRelationsPage({
  params: {
    conceptIdentifier,
    locale,
    semanticRelationTypeIdentifier: semanticRelationshipTypeIdentifierString,
  },
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

  const semanticRelationTypeIdentifier = Identifier.fromString({
    dataFactory,
    identifier: decodeFileName(semanticRelationshipTypeIdentifierString),
  });
  const semanticRelationType = Concept.SemanticRelation.Types.find(
    (semanticRelationType) =>
      semanticRelationType.property.equals(semanticRelationTypeIdentifier),
  );
  if (!semanticRelationType) {
    notFound();
  }

  const semanticRelations = await (
    await concept.semanticRelations(semanticRelationType)
  ).flatResolve();

  const translations = await getTranslations("ConceptSemanticRelationsPage");
  const semanticRelationTypeTranslations = await getTranslations(
    "SemanticRelationTypes",
  );

  return (
    <Layout>
      <PageTitleHeading>
        {translations("Concept")}: {concept.displayLabel}
      </PageTitleHeading>
      <Section
        title={semanticRelationTypeTranslations(
          semanticRelationType.property.value.replaceAll(".", "_"),
        )}
      >
        <ConceptList concepts={semanticRelations} />
      </Section>
    </Layout>
  );
}

export async function generateMetadata({
  params: {
    conceptIdentifier,
    locale,
    semanticRelationTypeIdentifier: semanticRelationshipTypeIdentifierString,
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

  const semanticRelationTypeIdentifier = Identifier.fromString({
    dataFactory,
    identifier: decodeFileName(semanticRelationshipTypeIdentifierString),
  });
  const semanticRelationType = Concept.SemanticRelation.Types.find(
    (semanticRelationType) =>
      semanticRelationType.property.equals(semanticRelationTypeIdentifier),
  );
  if (!semanticRelationType) {
    return {};
  }

  return (
    (await new PageMetadata({
      locale,
    }).conceptSemanticRelations({
      concept,
      semanticRelationType,
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

      for (const semanticRelationType of Concept.SemanticRelation.Types) {
        if (
          (await concept.semanticRelations(semanticRelationType)).length <=
          configuration.relatedConceptsPerSection
        ) {
          continue;
        }

        staticParams.push({
          conceptIdentifier,
          locale,
          semanticRelationTypeIdentifier: encodeFileName(
            Identifier.toString(semanticRelationType.property),
          ),
        });
      }
    }
  }

  return staticParams;
}
