import { createHash } from "node:crypto";
import * as urlSlug from "url-slug";

export function slugify(s: string) {
  const slug = urlSlug.convert(s);
  if (slug.length < 256) {
    return slug;
  }
  return createHash("sha256").update(s).digest("hex");
}
