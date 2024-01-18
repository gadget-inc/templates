import { Client } from "@gadget-client/airtable-template";

export const api = new Client({ environment: window.gadgetConfig.environment });
