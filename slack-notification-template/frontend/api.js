import { Client } from "@gadget-client/slack-notification-template";

export const api = new Client({ environment: window.gadgetConfig.environment });
