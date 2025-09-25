import { Client } from "@gadget-client/wishlist-public-remix-ssr";

// The environment prop should match the environment you're working on and be changed to "production" before deployment
export const api = new Client({ environment: "development" });
