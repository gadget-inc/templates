// Sets up the API client for interacting with your backend.
// For your API reference, visit: https://docs.gadget.dev/api/product-quiz-public-rrv7-d
import { Client } from "@gadget-client/wishlist-custom-rrv7-d";

export const api = new Client({ environment: window.gadgetConfig.environment });
