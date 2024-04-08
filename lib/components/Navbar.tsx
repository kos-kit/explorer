import { PageHrefs } from "@/app/PageHrefs";
import { ListBulletIcon } from "@heroicons/react/24/solid";
import { Link } from "@/lib/components/Link";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { PageMetadata } from "@/app/PageMetadata";
import { SearchBox } from "./SearchBox";
import searchEngine from "@/app/searchEngine";

export async function Navbar({ languageTag }: { languageTag: LanguageTag }) {
  const searchEngine_ = await searchEngine();

  const title: string = (await PageMetadata.root({ languageTag }))
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
        <div className="flex justify-end min-w-64">
          {/* <div className="relative block"> */}
          <SearchBox
            languageTag={languageTag}
            searchEngineJson={searchEngine_.toJson()}
          />
          {/* <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="sr-only">Search icon</span>
            </div>
            <input
              autoFocus
              className="block w-full min-w-64 p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
              type="text"
            /> */}
          {/* </div> */}
        </div>
      </div>
    </nav>
  );
}
