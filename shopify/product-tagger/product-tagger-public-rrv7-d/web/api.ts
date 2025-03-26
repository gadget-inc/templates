// Sets up the API client for interacting with your backend. 
// For your API reference, visit: https://docs.gadget.dev/api/product-tagger-public-rrv7-d
import { Client } from "@gadget-client/product-tagger-public-rrv7-d";

export const api = new Client({ environment: window.gadgetConfig.environment });
