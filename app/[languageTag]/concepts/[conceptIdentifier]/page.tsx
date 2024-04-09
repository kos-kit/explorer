import configuration from "@/app/configuration";
import modelSet from "@/app/modelSet";
import { PageHrefs } from "@/app/PageHrefs";
import { PageMetadata } from "@/app/PageMetadata";
import { ConceptList } from "@/lib/components/ConceptList";
import { LabelSections } from "@/lib/components/LabelSections";
import { Layout } from "@/lib/components/Layout";
import { Link } from "@/lib/components/Link";
import { Section } from "@/lib/components/Section";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { noteProperties } from "@/lib/models/noteProperties";
import { semanticRelationProperties } from "@/lib/models/semanticRelationProperties";
import { defilenamify } from "@/lib/utilities/defilenamify";
import { displayLabel } from "@/lib/utilities/displayLabel";
import { filenamify } from "@/lib/utilities/filenamify";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { stringToIdentifier } from "@/lib/utilities/stringToIdentifier";
import { xsd } from "@/lib/vocabularies";
import { Metadata } from "next";
import React from "react";

interface ConceptPageParams {
  conceptIdentifier: string;
  languageTag: LanguageTag;
}

export default async function ConceptPage({
  params: { conceptIdentifier, languageTag },
}: {
  params: ConceptPageParams;
}) {
  const concept = await modelSet.conceptByIdentifier(
    stringToIdentifier(defilenamify(conceptIdentifier)),
  );

  const notations = await concept.notations();

  return (
    <Layout
      languageTag={languageTag}
      title={`Concept: ${await displayLabel({ languageTag, model: concept })}`}
    >
      <LabelSections languageTag={languageTag} model={concept} />
      {await Promise.all(
        noteProperties.map(async (noteProperty) => {
          const notes = await concept.notes(languageTag, noteProperty);
          if (notes.length === 0) {
            return null;
          }
          return (
            <Section key={noteProperty.name} title={`${noteProperty.label}s`}>
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
                  href={PageHrefs.conceptSemanticRelations({
                    conceptIdentifier: concept.identifier,
                    languageTag,
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
  return PageMetadata.concept({
    concept: await modelSet.conceptByIdentifier(
      stringToIdentifier(defilenamify(conceptIdentifier)),
    ),
    languageTag,
  });
}

export async function generateStaticParams(): Promise<ConceptPageParams[]> {
  const staticParams: ConceptPageParams[] = [];

  const languageTags = await modelSet.languageTags();

  for await (const concept of modelSet.concepts()) {
    for (const languageTag of languageTags) {
      staticParams.push({
        conceptIdentifier: filenamify(identifierToString(concept.identifier)),
        languageTag,
      });
    }
  }

  return staticParams;
}
