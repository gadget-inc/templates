import { Client } from "@gadget-client/sales-tracker-template";

export const api = new Client({ environment: window.gadgetConfig.environment });
