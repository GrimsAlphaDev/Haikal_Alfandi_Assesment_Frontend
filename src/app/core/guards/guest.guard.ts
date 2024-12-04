import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service.ts.service";
import { inject } from "@angular/core";

export const guestGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isAuthenticated()
    ? router.createUrlTree(['/dashboard'])
    : true;

}