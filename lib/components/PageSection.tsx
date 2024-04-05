import { PropsWithChildren } from "react";

export function PageSection({
  children,
  title,
}: PropsWithChildren<{ title: React.ReactElement | string }>) {
  return (
    <fieldset className="border border-black rounded p-4">
      <legend className="font-bold">{title}</legend>
      {children}
    </fieldset>
  );
}
