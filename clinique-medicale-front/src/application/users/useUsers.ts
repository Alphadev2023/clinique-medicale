// src/application/users/useUsers.ts

import { useQuery } from "@tanstack/react-query";
import { userService } from "../../infrastructure/userService";
import { userKeys } from "./userKeys";

export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: userService.lister,
  });
}
