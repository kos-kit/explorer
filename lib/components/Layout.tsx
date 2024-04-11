import { PropsWithChildren } from "react";
import { Navbar } from "@/lib/components/Navbar";
import { Footer } from "@/lib/components/Footer";
import { LanguageTag } from "@/lib/models/LanguageTag";

export function Layout({
  children,
  languageTag,
}: PropsWithChildren<{
  languageTag: LanguageTag;
}>) {
  return (
    <div className="flex flex-col gap-4 min-h-screen px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-4">
      <Navbar languageTag={languageTag} />
      <main className="flex-grow">
        <div className="flex flex-col gap-8">{children}</div>
      </main>
      <Footer languageTag={languageTag} />
    </div>
  );
}
