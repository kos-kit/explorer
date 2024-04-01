export default function Link({
  children,
  className,
  href,
  ...otherProps
}: {href: string} & Omit<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >,
  "href"
>) {
  return (
    <a
      className={className ? `${className} underline` : "underline"}
      href={href}
      {...otherProps}
    >
      {children}
    </a>
  );
}
