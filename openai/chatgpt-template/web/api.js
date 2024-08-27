import { Client } from "@gadget-client/chatgpt-template";

export const api = new Client({ environment: window.gadgetConfig.environment });
