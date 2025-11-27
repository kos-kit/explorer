import { PageMetadata } from "@/app/PageMetadata";
import { configuration } from "@/app/configuration";
import { kosFactory } from "@/app/kosFactory";
import { ConceptList } from "@/lib/components/ConceptList";
import { Layout } from "@/lib/components/Layout";
import { PageTitleHeading } from "@/lib/components/PageTitleHeading";
import { Section } from "@/lib/components/Section";
import { dataFactory } from "@/lib/dataFactory";
import {
  Identifier,
  Locale,
  PartialConcept,
  labels,
  semanticRelationProperties,
  semanticRelations,
} from "@/lib/models";
import { decodeFileName, encodeFileName } from "@kos-kit/next-utils";
import { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

interface ConceptSemanticRelationsPageParams {
  conceptIdentifier: string;
  locale: Locale;
  semanticRelationPropertyIdentifier: string;
}

export default async function ConceptSemanticRelationsPage({
  params: {
    conceptIdentifier,
    locale,
    semanticRelationPropertyIdentifier:
      semanticRelationshipPropertyIdentifierString,
  },
}: {
  params: ConceptSemanticRelationsPageParams;
}) {
  unstable_setRequestLocale(locale);

  const concept = (
    await (
      await kosFactory({ locale })
    ).concept(
      Identifier.fromString({
        dataFactory,
        identifier: decodeFileName(conceptIdentifier),
      }),
    )
  )
    .toMaybe()
    .extractNullable();
  if (!concept) {
    notFound();
  }

  const semanticRelationPropertyIdentifier = Identifier.fromString({
    dataFactory,
    identifier: decodeFileName(semanticRelationshipPropertyIdentifierString),
  });
  const semanticRelationProperty = semanticRelationProperties.find(
    (semanticRelationType) =>
      semanticRelationType.identifier.equals(
        semanticRelationPropertyIdentifier,
      ),
  );
  if (!semanticRelationProperty) {
    notFound();
  }

  let semanticallyRelatedConcepts: readonly PartialConcept[] = [];
  for (const [
    checkSemanticRelationProperty,
    checkSemanticallyRelatedConcepts,
  ] of semanticRelations(concept)) {
    if (checkSemanticRelationProperty.equals(semanticRelationProperty)) {
      semanticallyRelatedConcepts = checkSemanticallyRelatedConcepts;
      break;
    }
  }
  const translations = await getTranslations("ConceptSemanticRelationsPage");
  const semanticRelationTypeTranslations = await getTranslations(
    "SemanticRelationProperties",
  );

  return (
    <Layout>
      <PageTitleHeading>
        {translations("Concept")}: {labels(concept).display}
      </PageTitleHeading>
      <Section
        title={semanticRelationTypeTranslations(
          semanticRelationProperty.translationKey,
        )}
      >
        <ConceptList concepts={semanticallyRelatedConcepts} />
      </Section>
    </Layout>
  );
}

export async function generateMetadata({
  params: {
    conceptIdentifier,
    locale,
    semanticRelationPropertyIdentifier:
      semanticRelationshipPropertyIdentifierString,
  },
}: {
  params: ConceptSemanticRelationsPageParams;
}): Promise<Metadata> {
  const concept = (
    await (
      await kosFactory({ locale })
    ).conceptStub(
      Identifier.fromString({
        dataFactory,
        identifier: decodeFileName(conceptIdentifier),
      }),
    )
  )
    .toMaybe()
    .extractNullable();
  if (!concept) {
    return {};
  }

  const semanticRelationPropertyIdentifier = Identifier.fromString({
    dataFactory,
    identifier: decodeFileName(semanticRelationshipPropertyIdentifierString),
  });
  const semanticRelationProperty = semanticRelationProperties.find(
    (semanticRelationType) =>
      semanticRelationType.identifier.equals(
        semanticRelationPropertyIdentifier,
      ),
  );
  if (!semanticRelationProperty) {
    return {};
  }

  return (
    (await new PageMetadata({
      locale,
    }).conceptSemanticRelations({
      concept,
      semanticRelationProperty,
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
    const kos = await kosFactory({ locale });
    for (const conceptIdentifier of await kos.conceptIdentifiers({
      limit: null,
      offset: 0,
      query: { type: "All" },
    })) {
      (await kos.concept(conceptIdentifier)).ifRight((concept) => {
        const conceptIdentifierString = encodeFileName(
          Identifier.toString(conceptIdentifier),
        );

        for (const [
          semanticRelationProperty,
          semanticRelations_,
        ] of semanticRelations(concept)) {
          if (
            semanticRelations_.length <= configuration.relatedConceptsPerSection
          ) {
            continue;
          }

          staticParams.push({
            conceptIdentifier: conceptIdentifierString,
            locale,
            semanticRelationPropertyIdentifier: encodeFileName(
              Identifier.toString(semanticRelationProperty.identifier),
            ),
          });
        }
      });
    }
  }

  return staticParams;
}
