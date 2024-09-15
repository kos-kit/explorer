import { Link } from "@/lib/components/Link";
import { getHrefs } from "@/lib/getHrefs";
import { Concept, Identifier } from "@/lib/models";

export async function ConceptList({
  concepts,
}: {
  concepts: readonly Concept[];
}) {
  const hrefs = await getHrefs();

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
