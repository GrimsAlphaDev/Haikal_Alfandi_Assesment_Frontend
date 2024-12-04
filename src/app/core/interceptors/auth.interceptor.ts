import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { AuthService } from "../services/auth.service.ts.service";

export const authInterceptor: HttpInterceptorFn = (req,next) => {
    const authService = inject(AuthService);

    // clone request and add authorization header
    const authRequest = req.clone({
        setHeaders: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        }
    });

    return next(authRequest).pipe(
        catchError((error, caught) => {
            if (error.status === 401) {
                authService.logout();
                return throwError(() => new Error('Unauthorized'));
            }
            return throwError(() => error);
        })
    )
}