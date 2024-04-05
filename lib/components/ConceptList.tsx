import { Link } from "@/lib/components/Link";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { Pages } from "@/lib/Pages";
import { Concept } from "@/lib/models/Concept";
import { LanguageTag } from "../models/LanguageTag";

export function ConceptList({
  concepts,
  languageTag,
}: {
  concepts: readonly Concept[];
  languageTag: LanguageTag;
}) {
  return (
    <ul className="list-inside">
      {concepts.map((concept) => (
        <li key={identifierToString(concept.identifier)}>
          <Link href={Pages.concept({ concept, languageTag }).href}>
            {concept.prefLabel(languageTag)?.literalForm.value ??
              identifierToString(concept.identifier)}
          </Link>
        </li>
      ))}
    </ul>
  );
}
