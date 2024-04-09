import { LunrSearchEngine } from "@/lib/search/LunrSearchEngine";
import { SearchEngineType } from "@/lib/search/SearchEngineType";

export const createSearchEngineFromJson = (json: {
  [index: string]: any;
  type: SearchEngineType;
}) => {
  switch (json.type) {
    case "Lunr":
      return LunrSearchEngine.fromJson(json);
    default:
      throw new RangeError(json.type);
  }
};
