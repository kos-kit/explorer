import { base58 } from "@/lib/utilities/base58";

export const defilenamify = (value: string): string =>
  base58.decode(value).toString("utf-8");
