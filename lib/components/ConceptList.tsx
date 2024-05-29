import { Link } from "@/lib/components/Link";
import { PageHrefs } from "@/app/PageHrefs";
import { Concept, LanguageTag } from "@kos-kit/client/models";
import { identifierToString } from "@kos-kit/client/utilities";
import { displayLabel } from "../utilities/displayLabel";
import configuration from "@/app/configuration";

export async function ConceptList({
  concepts,
  languageTag,
}: {
  concepts: readonly Concept[];
  languageTag: LanguageTag;
}) {
  return (
    <ul className="list-disc list-inside">
      {await Promise.all(
        concepts.map(async (concept) => (
          <li key={identifierToString(concept.identifier)}>
            <Link
              href={PageHrefs.concept({
                conceptIdentifier: concept.identifier,
                languageTag,
              })}
            >
              {await displayLabel({ languageTag, model: concept })}
            </Link>
          </li>
        )),
      )}
    </ul>
  );
}
