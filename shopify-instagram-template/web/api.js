// Sets up the API client for interacting with your backend. 
// For your API reference, visit: https://docs.gadget.dev/api/shopify-instagram-template
import { Client } from "@gadget-client/shopify-instagram-template";

export const api = new Client({ environment: window.gadgetConfig.environment });
