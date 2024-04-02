import Link from "@/lib/components/Link";
import { identifierToString } from "@/lib/utilities/identifierToString";
import Pages from "@/lib/Pages";
import { Concept } from "@/lib/models/Concept";

export function ConceptList(concepts: readonly Concept[]) {
  <ul className="list-disc list-inside">
    {concepts.map((concept) => (
      <li key={identifierToString(concept.identifier)}>
        <Link href={Pages.concept(concept).href}>
          {concept.prefLabel.value}
        </Link>
      </li>
    ))}
  </ul>;
}
