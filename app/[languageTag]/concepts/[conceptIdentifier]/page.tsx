import configuration from "@/app/configuration";
import kos from "@/app/kos";
import { PageHrefs } from "@/app/PageHrefs";
import { PageMetadata } from "@/app/PageMetadata";
import { ConceptList } from "@/lib/components/ConceptList";
import { LabelSections } from "@/lib/components/LabelSections";
import { Layout } from "@/lib/components/Layout";
import { Link } from "@/lib/components/Link";
import { PageTitleHeading } from "@/lib/components/PageTitleHeading";
import { Section } from "@/lib/components/Section";
import { defilenamify, filenamify } from "@kos-kit/client/utilities";
import { displayLabel } from "@/lib/utilities/displayLabel";
import {
  LanguageTag,
  noteProperties,
  semanticRelationProperties,
} from "@kos-kit/client/models";
import {
  identifierToString,
  stringToIdentifier,
} from "@kos-kit/client/utilities";
import { Metadata } from "next";
import { xsd } from "@kos-kit/client/vocabularies";
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
  const concept = await kos.conceptByIdentifier(
    stringToIdentifier(defilenamify(conceptIdentifier)),
  );

  const notations = await concept.notations();

  return (
    <Layout languageTag={languageTag}>
      <PageTitleHeading>
        Concept: {await displayLabel({ languageTag, model: concept })}
      </PageTitleHeading>
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
                    basePath: configuration.nextBasePath,
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
    concept: await kos.conceptByIdentifier(
      stringToIdentifier(defilenamify(conceptIdentifier)),
    ),
    languageTag,
  });
}

export async function generateStaticParams(): Promise<ConceptPageParams[]> {
  if (configuration.dynamic) {
    return [];
  }

  const staticParams: ConceptPageParams[] = [];

  const languageTags = await kos.languageTags();

  for await (const concept of kos.concepts()) {
    for (const languageTag of languageTags) {
      staticParams.push({
        conceptIdentifier: filenamify(identifierToString(concept.identifier)),
        languageTag,
      });
    }
  }

  return staticParams;
}
