export const compressionMethods = [
  "application/gzip",
  "application/x-brotli",
  "application/x-bzip2",
] as const;
export type CompressionMethod = (typeof compressionMethods)[number];
