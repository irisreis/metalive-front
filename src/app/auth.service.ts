import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  authState,
  User
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of, from } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { SharedService } from '../app/services/shared.service';
import { PaymentService } from './payment.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<any>;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private sharedService: SharedService,
    private paymentService: PaymentService
  ) {
    this.user$ = authState(this.auth).pipe(
      switchMap((user: User | null) => {
        if (user) {
          return this.getUserData(user.uid, this.sharedService.collectionAux).pipe(
            switchMap((userData: any) => {
              if (userData) {
                const userWithRole = { uid: user.uid, email: user.email, ...userData };
                return of(userWithRole);
              } else {
                return of(null);
              }
            })
          );
        } else {
          return of(null);
        }
      })
    );
  }

  getUserId(): string | null {
    const user = this.auth.currentUser;
    return user ? user.uid : null;
  }

  async getToken(): Promise<string | null> {
    return localStorage.getItem('token');
  }

  getUserData(uid: string, collection: string): Observable<any> {
    const userDocRef = doc(this.firestore, `${collection}/${uid}`);
    return from(getDoc(userDocRef)).pipe(
      map(docSnap => (docSnap.exists() ? docSnap.data() : null)),
      catchError(error => {
        console.error('Erro ao buscar dados do Firestore:', error);
        return of(null);
      })
    );
  }

  getCollectionByRole(role: string): string {
    switch (role.toLowerCase()) {
      case 'nutricionista': return 'nutricionistas';
      case 'personal trainer': return 'personais';
      case 'cliente': return 'clientes';
      default: return 'users';
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem('token', token);

        const userDocRef = doc(this.firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const role = userDocSnap.data()['role'];
          this.redirectUserByRole(role, user.uid);
        } else {
          console.error('Usuário não encontrado na coleção "users".');
        }
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  }

  async register(nome: string, numeroTelefone: string, email: string, password: string, repeatPassword: string, role: string, paymentData: any): Promise<void> {
    if (password !== repeatPassword) throw new Error('As senhas não correspondem.');

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user?.uid;

      if (uid) {
        const token = await userCredential.user.getIdToken();
        localStorage.setItem('token', token);
        const collectionName = this.getCollectionByRole(role);
        
        await setDoc(doc(this.firestore, collectionName, uid), { nome, numeroTelefone, email, role });
        await setDoc(doc(this.firestore, 'users', uid), { nome, numeroTelefone, email, role });

        await this.processPayment(paymentData, uid);
        this.redirectUserByRole(role, uid);
      }
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
    }
  }

  private processPayment(paymentData: any, uid: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.paymentService.createCardHash(paymentData).then(cardHash => {
        this.paymentService.processPayment({ ...paymentData, cardHash }).subscribe({
          next: () => resolve(),
          error: error => reject(error)
        });
      }).catch(error => reject(error));
    });
  }

  private redirectUserByRole(role: string, uid: string): void {
    switch (role.toLowerCase()) {
      case 'nutricionista': this.router.navigate(['/nutricionista', uid]); break;
      case 'cliente': this.router.navigate(['/perfil', uid]); break;
      case 'personal trainer': this.router.navigate(['/personal', uid]); break;
      default: console.error('Papel de usuário não reconhecido:', role);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }
}
