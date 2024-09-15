import { ClientConfiguration } from "@/lib/models";
import { createContext } from "react";

export const ClientConfigurationContext = createContext<ClientConfiguration>({
  conceptsPerPage: -1,
  nextBasePath: "",
});
