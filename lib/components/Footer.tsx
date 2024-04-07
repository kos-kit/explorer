import modelSet from "@/app/modelSet";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { Literal, NamedNode } from "@rdfjs/types";
import { Link } from "@/lib/components/Link";
import { Fragment } from "react";

export async function Footer({ languageTag }: { languageTag: LanguageTag }) {
  let license: Literal | NamedNode | null = null;
  let rights: Literal | null = null;
  let rightsHolder: Literal | null = null;

  const conceptSchemes = await modelSet.conceptSchemes();
  if (conceptSchemes.length === 1) {
    const conceptScheme = conceptSchemes[0];
    license = await conceptScheme.license(languageTag);
    rights = await conceptScheme.rights(languageTag);
    rightsHolder = await conceptScheme.rightsHolder(languageTag);
  }

  if (license === null && rights === null && rightsHolder === null) {
    return null;
  }

  const rightsParts: React.ReactNode[] = [];
  const copyright = "© " + new Date().getFullYear();
  if (rightsHolder !== null) {
    rightsParts.push(copyright + " " + rightsHolder.value);
  } else {
    rightsParts.push(copyright);
  }
  if (rights !== null) {
    rightsParts.push(rights.value);
  }
  if (license !== null) {
    if (license.termType === "NamedNode") {
      rightsParts.push(<Link href={license.value}>License</Link>);
    } else {
      rightsParts.push(license.value);
    }
  }

  return (
    <footer
      className="flex items-center p-4"
      style={{
        background: "var(--foreground-color)",
        color: "var(--background-color)",
      }}
    >
      <div className="mx-auto w-full max-w-screen-xl text-center">
        {rightsParts.map((rightsPart, rightsPartI) => (
          <Fragment key={rightsPartI}>
            {rightsPart}
            {rightsPartI + 1 < rightsParts.length ? (
              <span>&nbsp;&middot;&nbsp;</span>
            ) : null}
          </Fragment>
        ))}
      </div>
    </footer>
  );
}
