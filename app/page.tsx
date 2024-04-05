import configuration from "./configuration";
import modelSet from "./modelSet";
import { ConceptSchemePage } from "@/lib/components/ConceptSchemePage";

export default function RootPage() {
  const conceptSchemes = [...modelSet.conceptSchemes];
  if (conceptSchemes.length === 1) {
    return (
      <ConceptSchemePage
        conceptScheme={conceptSchemes[0]}
        languageTag={configuration.defaultLanguageTag}
      />
    );
  }
  throw new RangeError("# of concept schemes: " + conceptSchemes.length);
}
