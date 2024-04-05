import { LanguageTag } from "../models/LanguageTag";

export function Footer({ languageTag }: { languageTag: LanguageTag }) {
  return (
    <footer
      className="flex items-center p-4"
      style={{
        background: "var(--foreground-color)",
        color: "var(--background-color)",
      }}
    >
      <div className="mx-auto w-full max-w-screen-xl text-center">
        {/* © 2024 <Link href="https://minorgordon.net">Minor Gordon</Link>
        <br />
        Licensed under the&nbsp; */}
      </div>
    </footer>
  );
}
