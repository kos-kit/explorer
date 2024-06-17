import { Link } from "@/lib/components/Link";
import { PropsWithChildren } from "react";
import { pageCount } from "@kos-kit/next-utils";

function PageLink({
  active,
  children,
  href,
}: PropsWithChildren<{
  active?: boolean;
  href: string | null;
}>) {
  if (href) {
    return (
      <Link className={`rounded p-1 ${active ? "font-bold" : ""}`} href={href}>
        {children}
      </Link>
    );
  } else {
    return <span className="rounded p-1">{children}</span>;
  }
}

export function Pagination({
  currentPage,
  itemsPerPage,
  itemsTotal,
  pageHref,
}: {
  currentPage: number; // Zero-based
  itemsPerPage: number;
  itemsTotal: number;
  pageHref: (page: number) => string;
}) {
  const pageCount_ = pageCount({ itemsPerPage, itemsTotal });
  const lastPage = pageCount_ - 1;
  const firstPage = 0;
  const previousPage = currentPage > 0 ? currentPage - 1 : null;
  const nextPage = currentPage + 1 < pageCount_ ? currentPage + 1 : null;

  return (
    <div className="flex sm:flex-row flex-col mt-2 items-center gap-2">
      <div className="flex gap-2">
        <PageLink href={currentPage !== firstPage ? pageHref(firstPage) : null}>
          <span className="w-5 h-5">{"<<"}</span>
        </PageLink>
        <PageLink href={previousPage !== null ? pageHref(previousPage) : null}>
          <span className="w-5 h-5">{"<"}</span>
        </PageLink>
        {[...Array(pageCount_).keys()].map((page) => (
          <PageLink
            active={page === currentPage}
            href={pageHref(page)}
            key={page}
          >
            {page + 1}
          </PageLink>
        ))}
        <PageLink href={nextPage !== null ? pageHref(nextPage) : null}>
          <span className="w-5 h-5">{">"}</span>
        </PageLink>
        <PageLink href={currentPage !== lastPage ? pageHref(lastPage) : null}>
          <span className="w-5 h-5">{">>"}</span>
        </PageLink>
        <span className="flex items-center gap-1"></span>
      </div>
    </div>
  );
}
