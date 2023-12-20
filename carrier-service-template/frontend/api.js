import { Client } from "@gadget-client/carrier-service-template";

export const api = new Client({ environment: window.gadgetConfig.environment });
