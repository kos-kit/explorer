import kosFactory from "@/app/kosFactory";
import { Link } from "@/lib/components/Link";
import { LanguageTag } from "@/lib/models";
import { Literal, NamedNode } from "@rdfjs/types";
import { Fragment } from "react";

export async function Footer({ languageTag }: { languageTag: LanguageTag }) {
  let license: Literal | NamedNode | null = null;
  let rights: Literal | null = null;
  let rightsHolder: Literal | null = null;

  const conceptSchemes = await (
    await (
      await kosFactory({ languageTag })
    ).conceptSchemes({ limit: null, offset: 0, query: { type: "All" } })
  ).flatResolve();
  if (conceptSchemes.length === 1) {
    const conceptScheme = conceptSchemes[0];
    license = conceptScheme.license.extractNullable();
    rights = conceptScheme.rights.extractNullable();
    rightsHolder = conceptScheme.rightsHolder.extractNullable();
  }

  if (license === null && rights === null && rightsHolder === null) {
    return null;
  }

  const rightsParts: React.ReactNode[] = [];
  const copyright = `© ${new Date().getFullYear().toString()}`;
  if (rightsHolder !== null) {
    rightsParts.push(
      <span
        dangerouslySetInnerHTML={{
          __html: `${copyright} ${rightsHolder.value}`,
        }}
      />,
    );
  } else {
    rightsParts.push(copyright);
  }
  if (rights !== null) {
    rightsParts.push(
      <span dangerouslySetInnerHTML={{ __html: rights.value }} />,
    );
  }
  if (license !== null) {
    if (license.termType === "NamedNode") {
      rightsParts.push(<Link href={license.value}>License</Link>);
    } else {
      rightsParts.push(
        <span dangerouslySetInnerHTML={{ __html: license.value }} />,
      );
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
