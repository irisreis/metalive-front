import { Injectable } from "@angular/core";
import { Auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, authState } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Observable para o estado do usuário autenticado com dados do Firestore
  user$: Observable<any>;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    // Inicializando o observable do estado de autenticação do Firebase e carregando os dados do Firestore
    this.user$ = authState(this.auth).pipe(
      switchMap(user => {
        if (user) {
          // Obtém o documento do usuário no Firestore
          const userDocRef = doc(this.firestore, `users/${user.uid}`);
          return getDoc(userDocRef).then(docSnapshot => {
            if (docSnapshot.exists()) {
              // Retorna os dados do usuário, incluindo o role
              return { uid: user.uid, email: user.email, ...docSnapshot.data() };
            } else {
              // Retorna null se o documento não existir
              return null;
            }
          });
        } else {
          return of(null);  // Retorna null se não estiver logado
        }
      })
    );
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  async register(email: string, password: string, role: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user?.uid;

      if (uid) {
        // Salvar dados adicionais no Firestore, incluindo o role
        const userDocRef = doc(this.firestore, 'users', uid);
        await setDoc(userDocRef, {
          email: email,
          role: role // Adiciona o role (nutricionista, cliente, ou personal trainer)
        });

        // Redirecionar para o dashboard correto
        if (role === 'Nutricionista') {
          this.router.navigate(['/nutricionista']);
        } else if (role === 'cliente') {
          this.router.navigate(['/perfil']);
        } else if (role === 'Personal Trainer') {
          this.router.navigate(['/personal']);
        } else {
          console.log('Erro no direcionamento no arquivo auth.service.ts');
        }
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  }
}
