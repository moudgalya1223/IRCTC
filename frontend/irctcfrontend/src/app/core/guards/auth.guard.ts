import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (typeof window === 'undefined') {
    return true;
  }

  return window.localStorage.getItem('access_token')
    ? true
    : router.createUrlTree(['/login']);
};
