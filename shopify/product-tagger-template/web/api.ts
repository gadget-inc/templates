import { Client } from "@gadget-client/product-tagger-template";

export const api = new Client({ environment: window.gadgetConfig.environment });
