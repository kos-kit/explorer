import { PageHrefs } from "@/app/PageHrefs";
import { ListBulletIcon } from "@heroicons/react/24/solid";
import { Link } from "@/lib/components/Link";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { PageMetadata } from "@/app/PageMetadata";
// import { SearchBox } from "./SearchBox";
// import searchEngine from "@/app/searchEngine";
import { LanguageSelector } from "./LanguageSelector";
import modelSet from "@/app/modelSet";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { SearchForm } from "./SearchForm";
// import { SearchEngineType } from "../search/SearchEngineType";

export async function Navbar({ languageTag }: { languageTag: LanguageTag }) {
  // const searchEngineJson = JSON.parse(
  //   JSON.stringify((await searchEngine()).toJson()),
  // );
  // const searchEngineJson = { type: "Lunr" as SearchEngineType };

  const title: string = (await PageMetadata.languageTag({ languageTag }))
    .title as string;

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap justify-between">
        <Link
          href={PageHrefs.root}
          className="flex space-x-3 rtl:space-x-reverse"
        >
          <ListBulletIcon className="h-8 w-8" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            {title}
          </span>
        </Link>
        <div className="flex gap-4 justify-end">
          <SearchForm languageTag={languageTag} />
          <LanguageSelector
            availableLanguageTags={await modelSet.languageTags()}
          />
        </div>
      </div>
    </nav>
  );
}
