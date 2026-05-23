import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";
import { Role } from "../../shared/models/user.model";

export const roleGuard = (allowedRoles: Role[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const role = authService.getRole();

    if (role && allowedRoles.includes(role)) {
      return true;
    }

    router.navigate(['/tickets']);
    return false;
  };
};