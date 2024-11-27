import { v4 as uuidv4 } from "uuid";

export default {
  queue: {
    name: `send-wishlist-emails-${uuidv4()}`,
    maxConcurrency: 50,
  },
  retries: 1,
};