import modelSet from "./modelSet";
import Pages from "@/lib/Pages";
import { redirect } from "next/navigation";

export default function RootPage() {
  const conceptSchemes = [...modelSet.conceptSchemes];
  if (conceptSchemes.length === 1) {
    const conceptScheme = conceptSchemes[0];
    redirect(Pages.conceptScheme({ conceptScheme, languageTag: "en" }).href);
  }
  throw new RangeError("# of concept schemes: " + conceptSchemes.length);
}
