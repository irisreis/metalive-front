import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../app/auth.service';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { SharedService } from '../../app/services/shared.service'; // Ajuste o caminho conforme necessário

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private sharedService: SharedService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const expectedRole = route.data['role'];
    console.log('Esperado: ' + expectedRole);

    // Definindo a coleção de acordo com a role esperada
    if (expectedRole.toLowerCase() === 'cliente') {
      this.sharedService.collectionAux = 'clientes';
    } else if (expectedRole.toLowerCase() === 'nutricionista') {
      this.sharedService.collectionAux = 'nutricionistas';
    } else if (expectedRole.toLowerCase() === 'personal trainer') {
      this.sharedService.collectionAux = 'personais';
    } else {
      console.log('Erro na coleção/expectedRole');
      this.router.navigate(['/login']); // Redireciona caso o role não seja encontrado
      return of(false); // Retorna false se o expectedRole não corresponder a nenhum caso
    }

    return this.authService.user$.pipe(
      switchMap(user => {
        console.log('Usuário no RoleGuard:', user);
        if (user) {
          console.log('Usuário autenticado:', user);
          return this.authService.getUserData(user.uid, this.sharedService.collectionAux).pipe(
            map(userData => {
              if (userData) {
                console.log('Dados do usuário retornados:', userData);
                if (userData.role.toLowerCase() === expectedRole.toLowerCase()) {
                  console.log('Usuário com a role correta: ' + userData.role);
                  return true; // Permite o acesso
                } else {
                  console.log('Role diferente do esperado:', userData.role);
                  this.router.navigate(['/login']); // Redireciona se a role for diferente
                  return false; // Bloqueia o acesso
                }
              } else {
                console.log('Nenhum dado do usuário encontrado.');
                this.router.navigate(['/login']); // Redireciona se não houver dados do usuário
                return false; // Bloqueia o acesso se não encontrar dados do usuário
              }
            })
          );
        } else {
          console.log('Nenhum usuário autenticado.');
          this.router.navigate(['/login']); // Redireciona se não houver usuário autenticado
          return of(false); // Bloqueia o acesso se não houver usuário autenticado
        }
      })
    );
  }
}
