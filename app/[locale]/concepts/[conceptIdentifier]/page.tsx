import { PageMetadata } from "@/app/PageMetadata";
import { configuration } from "@/app/configuration";
import { kosFactory } from "@/app/kosFactory";
import { ConceptList } from "@/lib/components/ConceptList";
import { LabelSections } from "@/lib/components/LabelSections";
import { Layout } from "@/lib/components/Layout";
import { Link } from "@/lib/components/Link";
import { PageTitleHeading } from "@/lib/components/PageTitleHeading";
import { Section } from "@/lib/components/Section";
import { dataFactory } from "@/lib/dataFactory";
import { getHrefs } from "@/lib/getHrefs";
import {
  Identifier,
  Locale,
  labels,
  notes,
  semanticRelations,
} from "@/lib/models";
import { decodeFileName, encodeFileName } from "@kos-kit/next-utils";
import { xsd } from "@tpluscode/rdf-ns-builders";
import { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import React from "react";

interface ConceptPageParams {
  conceptIdentifier: string;
  locale: Locale;
}

export default async function ConceptPage({
  params: { conceptIdentifier, locale },
}: {
  params: ConceptPageParams;
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

  const hrefs = await getHrefs();

  const notations = concept.notation;

  const translations = await getTranslations("ConceptPage");
  const notePropertyTranslations = await getTranslations("NoteProperties");
  const semanticRelationPropertyTranslations = await getTranslations(
    "SemanticRelationProperties",
  );

  return (
    <Layout>
      <PageTitleHeading>
        {translations("Concept")}: {labels(concept).display}
      </PageTitleHeading>
      <LabelSections kosResource={concept} />
      {notes(concept).map(([noteProperty, notes]) => (
        <Section
          key={noteProperty.identifier.value}
          title={notePropertyTranslations(noteProperty.translationKey)}
        >
          <table className="w-full">
            <tbody>
              {notes.map((literal, literalI) => (
                <tr key={literalI}>
                  <td>{literal.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      ))}
      {notations.length > 0 ? (
        <Section title={translations("Notations")}>
          <ul className="list-disc list-inside">
            {notations.map((notation, notationI) => (
              <li key={notationI}>
                {notation.value}
                {!notation.datatype.equals(xsd.string)
                  ? ` ${notation.datatype.value} `
                  : ""}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
      {semanticRelations(concept).map(
        ([semanticRelationProperty, conceptStubs]) => (
          <Section
            key={semanticRelationProperty.identifier.value}
            title={semanticRelationPropertyTranslations(
              semanticRelationProperty.translationKey,
            )}
          >
            <ConceptList
              concepts={
                conceptStubs.length <= configuration.relatedConceptsPerSection
                  ? conceptStubs
                  : conceptStubs.slice(
                      0,
                      configuration.relatedConceptsPerSection,
                    )
              }
            />
            {conceptStubs.length > configuration.relatedConceptsPerSection ? (
              <Link
                href={hrefs.conceptSemanticRelations({
                  concept,
                  semanticRelationProperty,
                })}
              >
                {translations("More")}
              </Link>
            ) : null}
          </Section>
        ),
      )}
    </Layout>
  );
}

export async function generateMetadata({
  params: { conceptIdentifier, locale },
}: {
  params: ConceptPageParams;
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
  return (await new PageMetadata({ locale }).concept(concept)) ?? {};
}

export async function generateStaticParams(): Promise<ConceptPageParams[]> {
  if (configuration.dynamic) {
    return [];
  }

  const staticParams: ConceptPageParams[] = [];

  for (const locale of configuration.locales) {
    for (const conceptIdentifier of await (
      await kosFactory({ locale })
    ).conceptIdentifiers({
      limit: null,
      offset: 0,
      query: { type: "All" },
    })) {
      staticParams.push({
        conceptIdentifier: encodeFileName(
          Identifier.toString(conceptIdentifier),
        ),
        locale,
      });
    }
  }

  return staticParams;
}
