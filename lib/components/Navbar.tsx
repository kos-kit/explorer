import { PageMetadata } from "@/app/PageMetadata";
import { configuration } from "@/app/configuration";
import { Link } from "@/lib/components/Link";
import { getHrefs } from "@/lib/getHrefs";
import { ListBulletIcon } from "@heroicons/react/24/solid";
import { getLocale } from "next-intl/server";
import { LanguageSelector } from "./LanguageSelector";
import { SearchForm } from "./SearchForm";

export async function Navbar() {
  const hrefs = await getHrefs();
  const title: string = (
    await new PageMetadata({ locale: await getLocale() }).locale()
  ).title as string;

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap justify-between">
        <Link
          href={hrefs.locale}
          className="flex space-x-3 rtl:space-x-reverse"
        >
          <ListBulletIcon className="h-8 w-8" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            {title}
          </span>
        </Link>
        <div className="flex gap-4 justify-end">
          <SearchForm />
          {configuration.locales.length > 1 ? (
            <LanguageSelector availableLanguageTags={configuration.locales} />
          ) : null}
        </div>
      </div>
    </nav>
  );
}
