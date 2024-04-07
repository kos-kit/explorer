import configuration from "@/app/configuration";
import modelSet from "@/app/modelSet";
import { Pages } from "@/app/Pages";
import { ConceptList } from "@/lib/components/ConceptList";
import { LabelTable } from "@/lib/components/LabelTable";
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

  const sections: (React.ReactElement | null)[] = await Promise.all(
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
  );

  return (
    <Layout
      languageTag={languageTag}
      title={`Concept: ${displayLabel({ languageTag, model: concept })}`}
    >
      <Section title="Labels">
        <LabelTable model={concept} />
      </Section>
      {sections}
    </Layout>
  );
}

export async function generateMetadata({
  params: { conceptIdentifier, languageTag },
}: {
  params: ConceptPageParams;
}): Promise<Metadata> {
  const concept = await modelSet.conceptByIdentifier(
    stringToIdentifier(defilenamify(conceptIdentifier)),
  );

  return (await Pages.concept({ concept, languageTag })).metadata;
}

export async function generateStaticParams(): Promise<ConceptPageParams[]> {
  const staticParams: ConceptPageParams[] = [];

  const conceptsCount = await modelSet.conceptsCount();
  const limit = 100;
  const languageTags = await modelSet.languageTags();
  let offset = 0;
  while (offset < conceptsCount) {
    for (const concept of await modelSet.concepts({ limit, offset })) {
      for (const languageTag of languageTags) {
        staticParams.push({
          conceptIdentifier: filenamify(identifierToString(concept.identifier)),
          languageTag,
        });
      }
      offset++;
    }
  }

  return staticParams;
}
