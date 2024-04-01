import { ConceptIdentifier } from "../models/Identifier";
import { Literal } from "@rdfjs/types";
import Link from "./Link";
import { Hrefs } from "../Hrefs";

export function ConceptList(
  concepts: readonly { identifier: ConceptIdentifier; prefLabel: Literal }[],
) {
  <ul className="list-disc list-inside">
    {concepts.map(concept => (<li key={concept.identifier.}))}
    <li>
      <Link href={Hrefs.type({ name: "Dataset" })}>Dataset</Link> type?
    </li>
  </ul>;
}
