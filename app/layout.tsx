import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/lib/components/Navbar";
import { Footer } from "@/lib/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen justify-between">
          <Navbar />
          <main className="flex-grow px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-4">
            <div className="flex flex-col gap-8">{children}</div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
