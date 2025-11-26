import { LunrSearchEngine } from "./LunrSearchEngine.js";
import { SearchEngineType } from "./SearchEngineType.js";
import { ServerSearchEngine } from "./ServerSearchEngine.js";

export const createSearchEngineFromJson = (json: {
  [index: string]: any;
  type: SearchEngineType;
}) => {
  switch (json.type) {
    case "Lunr":
      return LunrSearchEngine.fromJson(json);
    case "Server":
      return ServerSearchEngine.fromJson(json);
    default:
      throw new RangeError(json.type);
  }
};
