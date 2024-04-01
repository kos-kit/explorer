import { Identifier } from "@/lib/models/Identifier";
import { identifierToString } from "@/lib/utilities/identifierToString";
import { slugify } from "@/lib/utilities/slugify";

export class Hrefs {
  static get root() {
    return "/";
  }

  static concept({ identifier }: { identifier: Identifier }) {
    return `/concepts/${slugify(identifierToString(identifier))}`;
  }

  static conceptScheme({ identifier }: { identifier: Identifier }) {
    return `/conceptSchemes/${slugify(identifierToString(identifier))}`;
  }
}
