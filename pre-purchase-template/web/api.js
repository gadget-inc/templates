import { Client } from "@gadget-client/pre-purchase-template";

export const api = new Client({ environment: window.gadgetConfig.environment });
