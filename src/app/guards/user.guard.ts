import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const userGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userStorage = localStorage.getItem('user');

  console.log(userStorage);
  
  if (!userStorage) {
    if (state.url !== '/login') {
      router.navigateByUrl('/login');
    }
    return false;
  }

  const user = JSON.parse(userStorage);
                                  // 1 dia
  if (Number(user.lastLoginAt) + 86400000 < Date.now()) {
    localStorage.removeItem('user');
    if (state.url !== '/login') {
      router.navigateByUrl('/login');
    }
    return false;
  }

  return true;
};