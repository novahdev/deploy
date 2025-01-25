import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  let headers = req.headers;

  const session = authService.session;
  if (session) {
    headers = headers.set("X-App-Token", session.token);
  }

  return next(req.clone({ headers }));
};
