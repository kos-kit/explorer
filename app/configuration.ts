import { GlobalRef } from "@/lib/models/GlobalRef";
import { Configuration } from "@/lib/models/Configuration";

const configuration = new GlobalRef("configuration");
if (!configuration.value) {
  configuration.value = {
    conceptsPerPage: 50,
    relatedConceptsPerSection: 10,
  } satisfies Configuration;
}
export default configuration.value as Configuration;
