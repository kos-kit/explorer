import { ListBulletIcon } from "@heroicons/react/24/solid";
import { Link } from "@/lib/components/Link";
import { PageMetadata } from "@/app/PageMetadata";
import { LanguageSelector } from "./LanguageSelector";
import { SearchForm } from "./SearchForm";
import configuration from "@/app/configuration";
import { LanguageTag } from "@kos-kit/models";
import { Hrefs } from "../Hrefs";

export async function Navbar({ languageTag }: { languageTag: LanguageTag }) {
  const title: string = (await new PageMetadata({ languageTag }).languageTag())
    .title as string;

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap justify-between">
        <Link
          href={new Hrefs({ configuration, languageTag }).languageTag}
          className="flex space-x-3 rtl:space-x-reverse"
        >
          <ListBulletIcon className="h-8 w-8" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            {title}
          </span>
        </Link>
        <div className="flex gap-4 justify-end">
          <SearchForm languageTag={languageTag} />
          {configuration.languageTags.length > 1 ? (
            <LanguageSelector
              availableLanguageTags={configuration.languageTags}
            />
          ) : null}
        </div>
      </div>
    </nav>
  );
}
