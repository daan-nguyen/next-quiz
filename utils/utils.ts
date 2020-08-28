export const usersToArray = (users: Users): UserData[] => {
  const usersArray = Object.keys(users).map((key) => users[key]);
  usersArray.sort((a, b) => a.name.localeCompare(b.name));
  return usersArray;
};
