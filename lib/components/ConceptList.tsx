import { Link } from "@/lib/components/Link";
import configuration from "@/app/configuration";
import { Hrefs } from "../Hrefs";
import { Concept, LanguageTag } from "@kos-kit/models";

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
        concepts.map((concept) => (
          <li key={Concept.Identifier.toString(concept.identifier)}>
            <Link href={hrefs.concept(concept)}>{concept.displayLabel}</Link>
          </li>
        )),
      )}
    </ul>
  );
}
