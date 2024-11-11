import { GadgetRecord, User } from "@gadget-client/blog-template";
import { api } from "gadget-server";

export async function checkForSingleUser() {
  const existingUser = await api.user.maybeFindFirst();
  return existingUser;
}

export async function isPrimaryUser(user: GadgetRecord<User>) {
  const existingUser = await api.user.maybeFindFirst();

  if (existingUser?.id === user.id) {
    return true;
  }

  return false;
}
