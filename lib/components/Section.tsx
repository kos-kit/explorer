import { PropsWithChildren } from "react";

export function Section({
  children,
  title,
}: PropsWithChildren<{ title: React.ReactElement | string }>) {
  return (
    <fieldset className="border border-black border-2 rounded p-4">
      <legend className="font-bold">{title}</legend>
      {children}
    </fieldset>
  );
}
