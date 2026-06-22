// src/application/users/userKeys.ts

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  medecins: () => [...userKeys.all, "medecins"] as const,
  me: () => [...userKeys.all, "me"] as const,
};
