import { Link } from "@/lib/components/Link";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { PageHrefs } from "@/app/PageHrefs";
import { Concept } from "@/lib/models/Concept";
import { LanguageTag } from "../models/LanguageTag";
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
                basePath: configuration.nextBasePath,
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
