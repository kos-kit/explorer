import configuration from "@/app/configuration";
import { PageMetadata } from "@/app/PageMetadata";
import { ConceptList } from "@/lib/components/ConceptList";
import { LabelSections } from "@/lib/components/LabelSections";
import { Layout } from "@/lib/components/Layout";
import { Link } from "@/lib/components/Link";
import { PageTitleHeading } from "@/lib/components/PageTitleHeading";
import { Section } from "@/lib/components/Section";
import { defilenamify, filenamify } from "@kos-kit/next-utils";
import {
  LanguageTag,
  noteProperties,
  semanticRelationProperties,
} from "@kos-kit/models";
import { Metadata } from "next";
import React from "react";
import { Hrefs } from "@/lib/Hrefs";
import { xsd } from "@tpluscode/rdf-ns-builders";
import { notFound } from "next/navigation";
import { Identifier } from "@/lib/models/Identifier";
import kosFactory from "@/app/kosFactory";

interface ConceptPageParams {
  conceptIdentifier: string;
  languageTag: LanguageTag;
}

export default async function ConceptPage({
  params: { conceptIdentifier, languageTag },
}: {
  params: ConceptPageParams;
}) {
  const concept = (
    await (
      await kosFactory({ languageTag })
    ).conceptByIdentifier(
      Identifier.fromString(defilenamify(conceptIdentifier)),
    )
  ).extractNullable();
  if (!concept) {
    notFound();
  }

  const hrefs = new Hrefs({ configuration, languageTag });

  const notations = concept.notations;

  return (
    <Layout languageTag={languageTag}>
      <PageTitleHeading>Concept: {concept.displayLabel}</PageTitleHeading>
      <LabelSections model={concept} />
      {await Promise.all(
        noteProperties.map((noteProperty) => {
          const notes = concept.notes(noteProperty);
          if (notes.length === 0) {
            return null;
          }
          return (
            <Section key={noteProperty.name} title={noteProperty.pluralLabel}>
              <table className="w-full">
                <tbody>
                  {notes.map((note, noteI) => (
                    <tr key={noteI}>
                      <td>{note.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          );
        }),
      )}
      {notations.length > 0 ? (
        <Section title="Notations">
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
      {await Promise.all(
        semanticRelationProperties.map(async (semanticRelationProperty) => {
          const semanticRelations = await concept.semanticRelations(
            semanticRelationProperty,
          );
          if (semanticRelations.length === 0) {
            return null;
          }
          return (
            <Section
              key={semanticRelationProperty.name}
              title={`${semanticRelationProperty.label} concepts`}
            >
              <ConceptList
                concepts={
                  semanticRelations.length <=
                  configuration.relatedConceptsPerSection
                    ? semanticRelations
                    : semanticRelations.slice(
                        0,
                        configuration.relatedConceptsPerSection,
                      )
                }
                languageTag={languageTag}
              />
              {semanticRelations.length >
              configuration.relatedConceptsPerSection ? (
                <Link
                  href={hrefs.conceptSemanticRelations({
                    concept,
                    semanticRelationProperty,
                  })}
                >
                  More
                </Link>
              ) : null}
            </Section>
          );
        }),
      )}
    </Layout>
  );
}

export async function generateMetadata({
  params: { conceptIdentifier, languageTag },
}: {
  params: ConceptPageParams;
}): Promise<Metadata> {
  const concept = (
    await (
      await kosFactory({ languageTag })
    ).conceptByIdentifier(
      Identifier.fromString(defilenamify(conceptIdentifier)),
    )
  ).extractNullable();
  if (!concept) {
    return {};
  }
  return (await new PageMetadata({ languageTag }).concept(concept)) ?? {};
}

export async function generateStaticParams(): Promise<ConceptPageParams[]> {
  if (configuration.dynamic) {
    return [];
  }

  const staticParams: ConceptPageParams[] = [];

  for (const languageTag of configuration.languageTags) {
    for await (const concept of (
      await kosFactory({ languageTag })
    ).concepts()) {
      staticParams.push({
        conceptIdentifier: filenamify(Identifier.toString(concept.identifier)),
        languageTag,
      });
    }
  }

  return staticParams;
}
