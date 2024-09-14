import { configuration } from "@/app/configuration";
import { Link } from "@/lib/components/Link";
import { Concept, Identifier, LanguageTag } from "@/lib/models";
import { Hrefs } from "../Hrefs";

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
      {
        await Promise.all(
          concepts.map((concept) => (
            <li key={Identifier.toString(concept.identifier)}>
              <Link href={hrefs.concept(concept)}>{concept.displayLabel}</Link>
            </li>
          )),
        )
      }
    </ul>
  );
}
