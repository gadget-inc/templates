export async function checkForSingleUser({ api }) {
  const existingUser = await api.user.maybeFindFirst();
  return existingUser;
}

export async function isPrimaryUser({ api, user }) {
  const existingUser = await api.user.maybeFindFirst();

  if (existingUser.id === user.id) {
    return true;
  }

  return false;
}
