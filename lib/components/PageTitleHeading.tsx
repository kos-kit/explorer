import { PropsWithChildren } from "react";

export function PageTitleHeading({ children }: PropsWithChildren) {
  return <h1 className="font-bold text-xl">{children}</h1>;
}
