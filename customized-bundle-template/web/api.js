import { Client } from "@gadget-client/customized-bundle-template";

export const api = new Client({ environment: window.gadgetConfig.environment });
