// src/application/users/useMedecins.ts

import { useQuery } from "@tanstack/react-query";
import { userService } from "../../infrastructure/userService";
import { userKeys } from "./userKeys";

export function useMedecins() {
  return useQuery({
    queryKey: userKeys.medecins(),
    queryFn: userService.listerMedecins,
  });
}
