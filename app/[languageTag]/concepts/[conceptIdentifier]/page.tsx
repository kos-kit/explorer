import modelSet from "@/app/modelSet";
import { Pages } from "@/app/Pages";
import { LabelTable } from "@/lib/components/LabelTable";
import { Layout } from "@/lib/components/Layout";
import { PageTitle } from "@/lib/components/PageTitle";
import { Section } from "@/lib/components/Section";
import { LanguageTag } from "@/lib/models/LanguageTag";
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
      title={
        <span>
          Concept:{" "}
          {concept.prefLabel(languageTag)?.literalForm.value ??
            identifierToString(concept.identifier)}
        </span>
      }
    >
      <Section title="Labels">
        <LabelTable model={concept} />
      </Section>
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

  const concepts = modelSet.concepts;
  if (concepts.length > 1) {
    for (const concept of concepts) {
      for (const languageTag of modelSet.languageTags) {
        staticParams.push({
          conceptIdentifier: filenamify(identifierToString(concept.identifier)),
          languageTag,
        });
      }
    }
  } // Else the root page will be the concept scheme

  return staticParams;
}
