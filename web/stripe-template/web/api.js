import { Client } from "@gadget-client/stripe-template";

export const api = new Client({ environment: window.gadgetConfig.environment });
