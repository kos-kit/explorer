import { LunrSearchEngine } from "@/lib/search/LunrSearchEngine";
import { SearchEngineType } from "@/lib/search/SearchEngineType";

export const createSearchEngineFromClientJson = (clientJson: {
  [index: string]: any;
  type: SearchEngineType;
}) => {
  switch (clientJson.type) {
    case "Lunr":
      return LunrSearchEngine.fromClientJson(clientJson);
    default:
      throw new RangeError(clientJson.type);
  }
};
