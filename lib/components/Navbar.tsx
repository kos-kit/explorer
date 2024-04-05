// import { PuzzlePieceIcon } from "@heroicons/react/24/solid";

export function Navbar({ languageTag }: { languageTag: string }) {
  return (
    <nav
      className="flex items-center p-4"
      style={{
        background: "var(--foreground-color)",
        color: "var(--background-color)",
      }}
    >
      {/* <div className="flex items-center">
        <PuzzlePieceIcon className="mr-2 w-6" />
        <a href={Pages.root} className="mr-8 block lg:inline-block text-xl">
          <b>Dive Into Schema.org</b>
        </a>
      </div>
      <div className="flex gap-8 text-xl">
        <a href={Hrefs.types} className="blocklg:inline-block">
          Types
        </a>
        <a href={Hrefs.about} className="blocklg:inline-block">
          About
        </a>
      </div> */}
    </nav>
  );
}
