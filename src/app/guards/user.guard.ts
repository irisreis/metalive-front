import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const userGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userStorage = localStorage.getItem("user");
  
  if (!userStorage) {
    router.navigateByUrl("/login");
    return false;
  }

  const user = JSON.parse(userStorage);
                                  // 1 dia
  if (Number(user.lastLoginAt) + 86400000 < Date.now()) {
    localStorage.removeItem("user");
    router.navigateByUrl("/login");
    return false;
  }

  return true;
};