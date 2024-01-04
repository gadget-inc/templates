import { Client } from "@gadget-client/product-quiz-v5";

export const api = new Client({ environment: window.gadgetConfig.environment });
