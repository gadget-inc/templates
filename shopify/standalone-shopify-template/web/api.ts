// Sets up the API client for interacting with your backend.
// For your API reference, visit: https://docs.gadget.dev/api/standalone-shopify-template
import { Client } from "@gadget-client/standalone-shopify-template";

export const api = new Client({ environment: window.gadgetConfig.environment });
