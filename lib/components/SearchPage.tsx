"use client";

import { LanguageTag } from "@/lib/models/LanguageTag";
import { SearchEngineType } from "@/lib/search/SearchEngineType";

export function SearchPage({
  languageTag,
  searchEngineJson,
}: {
  languageTag: LanguageTag;
  searchEngineJson: { [index: string]: any; type: SearchEngineType };
}) {
  return <div></div>;
}
