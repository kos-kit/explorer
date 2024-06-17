import { Link } from "@/lib/components/Link";
import configuration from "@/app/configuration";
import { Hrefs } from "../Hrefs";
import { Concept, LanguageTag } from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";

export async function ConceptList({
  concepts,
  languageTag,
}: {
  concepts: readonly Concept[];
  languageTag: LanguageTag;
}) {
  const hrefs = new Hrefs({ configuration, languageTag });

  return (
    <ul className="list-disc list-inside">
      {await Promise.all(
        concepts.map(async (concept) => (
          <li key={Resource.Identifier.toString(concept.identifier)}>
            <Link href={hrefs.concept(concept)}>{concept.displayLabel}</Link>
          </li>
        )),
      )}
    </ul>
  );
}
