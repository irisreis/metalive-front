import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const sessionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userStorage = localStorage.getItem('user');
  
  if (userStorage) {
    if (state.url === '/login' || state.url === '/cadastro') {
      router.navigateByUrl('/perfil');
    }
    return false;
  }

  return true;
};