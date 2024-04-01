import { Identifier } from "@/lib/models/Identifier";
import { Literal } from "@rdfjs/types";
import Link from "@/lib/components/Link";
import { identifierToString } from "@/lib/utilities/identifierToString";
import Pages from "@/lib/Pages";

export function ConceptList(
  concepts: readonly { identifier: Identifier; prefLabel: Literal }[],
) {
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
