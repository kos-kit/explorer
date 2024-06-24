import { redirect } from "next/navigation";
import configuration from "./configuration";

export default function RootPage() {
  redirect(`/${configuration.defaultLanguageTag}/`);
}
