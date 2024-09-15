import { getHrefs } from "@/lib/getHrefs";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { getTranslations } from "next-intl/server";

export async function SearchForm() {
  const hrefs = await getHrefs();
  const translations = await getTranslations("SearchForm");

  return (
    <form action={hrefs.search({})} className="flex gap-1" method="GET">
      <input
        className="w-full min-w-64 p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:border-black"
        name="query"
        placeholder={translations("placeholder")}
        type="search"
      />
      <button
        className="bg-gray-50 border border-gray-300 p-2 rounded text-gray-900"
        type="submit"
      >
        <MagnifyingGlassIcon className="w-4 h-4 text-gray-500" />
        <span className="sr-only">Search icon</span>
      </button>
    </form>
  );
}
