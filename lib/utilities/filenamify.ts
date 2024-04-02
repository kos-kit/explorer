import { base58 } from "@/lib/utilities/base58";

export const filenamify = (value: string): string =>
  base58.encode(Buffer.from(value, "utf-8"));
