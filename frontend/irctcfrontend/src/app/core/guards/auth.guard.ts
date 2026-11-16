import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { NotificationService } from '../../shared/services/notification.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const notification = inject(NotificationService);
  if (typeof window === 'undefined') {
    return true;
  }

  if (window.localStorage.getItem('access_token')) {
    return true;
  }

  notification.showError('Please log in to search for trains.');
  return router.createUrlTree(['/login']);
};
