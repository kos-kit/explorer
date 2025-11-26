export const rdfFormats = [
  "application/ld+json",
  "application/n-quads",
  "application/n-triples",
  "application/rdf+xml",
  "application/trig",
  "text/turtle",
] as const;
export type RdfFormat = (typeof rdfFormats)[number];
