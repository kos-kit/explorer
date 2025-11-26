import { SearchEngineType } from "./SearchEngineType.js";

/**
 * JSON serialization of a SearchEngine.
 */
export interface SearchEngineJson {
  type: SearchEngineType;

  [index: string]: any;
}
