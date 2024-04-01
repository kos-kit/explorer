import { Identifier } from "@/lib/models/Identifier";
import { Literal } from "@rdfjs/types";
import Link from "@/lib/components/Link";
import { Hrefs } from "@/lib/Hrefs";
import { identifierToString } from "@/lib/utilities/identifierToString";

export function ConceptList(
  concepts: readonly { identifier: Identifier; prefLabel: Literal }[],
) {
  <ul className="list-disc list-inside">
    {concepts.map((concept) => (
      <li key={identifierToString(concept.identifier)}>
        <Link href={Hrefs.concept(concept)}>{concept.prefLabel.value}</Link>
      </li>
    ))}
  </ul>;
}
