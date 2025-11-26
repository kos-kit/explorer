import { describe } from "vitest";
import { ServerSearchEngine } from "../ServerSearchEngine.js";
import { behavesLikeSearchEngine } from "./behavesLikeSearchEngine.js";

(process.env["CI"] ? describe.skip : describe)("ServerSearchEngine", () => {
  behavesLikeSearchEngine(() =>
    Promise.resolve(new ServerSearchEngine("http://localhost:7878/search")),
  );
});
