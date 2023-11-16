import { Client } from "@gadget-client/usage-subscription-template";

export const api = new Client({ environment: window.gadgetConfig.environment });
