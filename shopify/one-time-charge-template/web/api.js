import { Client } from "@gadget-client/one-time-charge-template";

export const api = new Client({ environment: window.gadgetConfig.environment });
