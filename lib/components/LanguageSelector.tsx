"use client";

// Adapted from https://simplelocalize.io/blog/posts/create-language-selector-with-nextjs-and-tailwind/

import React, { useEffect, useState } from "react";
import "@/node_modules/flag-icons/css/flag-icons.min.css";
import { LanguageTag } from "@/lib/models/LanguageTag";
import { usePathname, useRouter } from "next/navigation";
import { getLangNameFromCode } from "language-name-map";

function FlagIcon({ countryCode }: { countryCode: string }) {
  return (
    <span
      className={`fi fis inline-block mr-2 fi-${countryCode}`}
      style={{
        width: `20px !important`,
        height: `20px !important`,
        fontSize: `20px !important`,
        borderRadius: "100%",
        border: "none",
        boxShadow: "inset 0 0 0 2px rgba(0, 0, 0, .06)",
      }}
    />
  );
}

const LANGUAGE_SELECTOR_ID = "language-selector";

function languageTagCountryCode(languageTag: LanguageTag): string {
  switch (languageTag) {
    case "en":
      return "gb";
    default:
      return languageTag;
  }
}

function languageTagLabel(languageTag: LanguageTag): string {
  const langName = getLangNameFromCode(languageTag);
  if (langName) {
    return `${langName.native} (${languageTag})`;
  } else {
    return languageTag;
  }
}

export function LanguageSelector({
  availableLanguageTags,
}: {
  availableLanguageTags: readonly LanguageTag[];
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const pathnameSplit = pathname.split("/");
  const currentLanguageTag = pathnameSplit[1];

  useEffect(() => {
    const handleWindowClick = (event: any) => {
      const target = event.target.closest("button");
      if (target && target.id === LANGUAGE_SELECTOR_ID) {
        return;
      }
      setIsOpen(false);
    };
    window.addEventListener("click", handleWindowClick);
    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  if (pathname === "/") {
    return null;
  }

  const onChange = (newLanguageTag: LanguageTag) => {
    router.push(
      `/${newLanguageTag}${pathnameSplit.length > 2 ? "/" + pathnameSplit.slice(2).join("/") : ""}`,
    );
  };

  return (
    <div className="flex items-center z-40">
      <div className="relative inline-block text-left">
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            id={LANGUAGE_SELECTOR_ID}
            aria-haspopup="true"
            aria-expanded={isOpen}
          >
            <FlagIcon
              countryCode={languageTagCountryCode(currentLanguageTag)}
            />
            {languageTagLabel(currentLanguageTag)}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.293 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        {isOpen && (
          <div
            className="origin-top-right absolute right-0 mt-2 w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="language-selector"
          >
            <div className="py-1 grid grid-cols-2 gap-2" role="none">
              {availableLanguageTags.map((languageTag, languageTagI) => (
                <button
                  key={languageTag}
                  onClick={() => onChange(languageTag)}
                  className={`${
                    currentLanguageTag === languageTag
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700"
                  } block px-4 py-2 text-sm text-left items-center inline-flex hover:bg-gray-100 ${languageTagI % 2 === 0 ? "rounded-r" : "rounded-l"}`}
                  role="menuitem"
                >
                  <FlagIcon countryCode={languageTagCountryCode(languageTag)} />
                  <span className="truncate">
                    {languageTagLabel(languageTag)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
