// Sets up the API client for interacting with your backend. 
// For your API reference, visit: https://docs.gadget.dev/api/product-reviews-template
import { Client } from "@gadget-client/product-reviews-template";

export const api = new Client({ environment: window.gadgetConfig.environment });
