import { Hrefs } from "@/lib/Hrefs";
import { useClientConfiguration } from "@/lib/hooks/useClientConfiguration";
import { useLocale } from "next-intl";

export function useHrefs(): Hrefs {
  const clientConfiguration = useClientConfiguration();
  const locale = useLocale();
  return new Hrefs({
    locale,
    nextBasePath: clientConfiguration.nextBasePath,
  });
}
