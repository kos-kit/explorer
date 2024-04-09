import { redirect } from "next/navigation";
import { PageHrefs } from "./PageHrefs";
import configuration from "./configuration";

export default async function RootPage() {
  redirect(
    PageHrefs.languageTag({ languageTag: configuration.defaultLanguageTag }),
  );
}
