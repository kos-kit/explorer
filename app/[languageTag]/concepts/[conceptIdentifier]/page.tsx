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
import { filenamify } from "@/lib/utilities/filenamify";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { stringToIdentifier } from "@/lib/utilities/stringToIdentifier";
import { Metadata } from "next";

interface ConceptPageParams {
  conceptIdentifier: string;
  languageTag: LanguageTag;
}

export default function ConceptPage({
  params: { conceptIdentifier, languageTag },
}: {
  params: ConceptPageParams;
}) {
  const concept = modelSet.conceptByIdentifier(
    stringToIdentifier(defilenamify(conceptIdentifier)),
  );

  return (
    <Layout
      languageTag={languageTag}
      title={`Concept: ${
        concept.prefLabel(languageTag)?.literalForm.value ??
        identifierToString(concept.identifier)
      }`}
    >
      <Section title="Labels">
        <LabelTable model={concept} />
      </Section>
      {noteProperties.map((noteProperty) => {
        const notes = concept.notes(languageTag, noteProperty);
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
      })}
      {semanticRelationProperties.map((semanticRelationProperty) => {
        const semanticRelations = concept.semanticRelations(
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
                href={
                  Pages.conceptSemanticRelations({
                    concept,
                    languageTag,
                    semanticRelationProperty,
                  }).href
                }
              >
                More
              </Link>
            ) : null}
          </Section>
        );
      })}
    </Layout>
  );
}

export function generateMetadata({
  params: { conceptIdentifier, languageTag },
}: {
  params: ConceptPageParams;
}): Metadata {
  const concept = modelSet.conceptByIdentifier(
    stringToIdentifier(defilenamify(conceptIdentifier)),
  );

  return Pages.concept({ concept, languageTag }).metadata;
}

export function generateStaticParams(): ConceptPageParams[] {
  const staticParams: ConceptPageParams[] = [];

  const conceptsCount = modelSet.conceptsCount;
  const limit = 100;
  let offset = 0;
  while (offset < conceptsCount) {
    for (const concept of modelSet.concepts({ limit, offset })) {
      for (const languageTag of modelSet.languageTags) {
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
