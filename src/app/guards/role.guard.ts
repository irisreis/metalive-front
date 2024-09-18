import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../app/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const expectedRole = route.data['role'];  // Obtém o papel esperado da rota
    console.log('esperado: ' + expectedRole);

    return this.authService.user$.pipe(  // Supondo que você tenha um observable `user$` no AuthService
    map(user => {
      console.log('Usuário encontrado:', user);  // Veja o que é retornado como user
      if (user && user.role === expectedRole) {
        console.log('é ' + user.role);
        return true; // Permite o acesso
      } else {
        alert('Não autorizado.');
        console.log('Role do usuário:', user?.role);
        return false; // Bloqueia o acesso
      }
      })
    );
  }
}
