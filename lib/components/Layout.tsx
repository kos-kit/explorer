import { PropsWithChildren } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function Layout({
  children,
  languageTag,
  title,
}: PropsWithChildren<{
  languageTag: string;
  title: React.ReactElement;
}>) {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Navbar languageTag={languageTag} />
      <main className="flex-grow px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-4">
        <div className="flex flex-col gap-8">
          <h1 className="font-bold text-xl">{title}</h1>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
