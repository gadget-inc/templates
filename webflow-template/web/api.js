// Sets up the API client for interacting with your backend. 
// For your API reference, visit: https://docs.gadget.dev/api/webflow-template
import { Client } from "@gadget-client/webflow-template";

export const api = new Client({ environment: window.gadgetConfig.environment });
