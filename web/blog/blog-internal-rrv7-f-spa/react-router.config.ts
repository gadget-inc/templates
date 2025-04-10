import { reactRouterConfigOptions } from "gadget-server/react-router";
import type { Config } from "@react-router/dev/config";

export default { ...reactRouterConfigOptions, ssr: false } satisfies Config;
