import configuration from "@/app/configuration";
import { Hrefs } from "@/lib/Hrefs";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { LanguageTag } from "@kos-kit/models";

export function SearchForm({ languageTag }: { languageTag: LanguageTag }) {
  return (
    <form
      action={new Hrefs({ configuration, languageTag }).search({})}
      className="flex gap-1"
      method="GET"
    >
      <input
        className="w-full min-w-64 p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded bg-gray-50 focus:border-black"
        name="query"
        placeholder="Search..."
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
