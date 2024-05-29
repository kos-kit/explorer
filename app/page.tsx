import { redirect } from "next/navigation";
import configuration from "./configuration";

export default async function RootPage() {
  redirect(`/${configuration.defaultLanguageTag}/`);
}
