import { Link } from "@/lib/components/Link";
import { Concept, LanguageTag } from "@kos-kit/client/models";
import { identifierToString } from "@kos-kit/client/utilities";
import { displayLabel } from "../utilities/displayLabel";
import configuration from "@/app/configuration";
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
      {await Promise.all(
        concepts.map(async (concept) => (
          <li key={identifierToString(concept.identifier)}>
            <Link href={hrefs.concept(concept)}>
              {await displayLabel({ languageTag, model: concept })}
            </Link>
          </li>
        )),
      )}
    </ul>
  );
}
