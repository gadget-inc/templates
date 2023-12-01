import { Client } from "@gadget-client/monthly-subscription-template";

export const api = new Client({ environment: window.gadgetConfig.environment });
