import { Identifier } from "./models/Identifier";
import { identifierToString } from "./utilities/identifierToString";
import { slugify } from "./utilities/slugify";

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
