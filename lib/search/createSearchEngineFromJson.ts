import { LunrSearchEngine } from "@/lib/search/LunrSearchEngine";
import { SearchEngineType } from "@/lib/search/SearchEngineType";

export const createSearchEngineFromJson = (clientJson: {
  [index: string]: any;
  type: SearchEngineType;
}) => {
  switch (clientJson.type) {
    case "Lunr":
      return LunrSearchEngine.fromJson(clientJson);
    default:
      throw new RangeError(clientJson.type);
  }
};
