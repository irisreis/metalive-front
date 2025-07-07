import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  authState,
  User // Importe User
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
//import { PaymentService } from './payment.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Essa propriedade user$ já é o Observable que você precisa!
  // Ela já observa authState e busca os dados adicionais do usuário.
  user$: Observable<any>; 

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private sharedService: SharedService,
    //private paymentService: PaymentService
  ) {
    this.user$ = authState(this.auth).pipe(
      switchMap((user: User | null) => { // Aqui 'user' já é tipado como User | null
        if (user) {
          // Sua lógica existente para buscar dados adicionais do usuário
          // e combinar com os dados do Firebase Auth.
          // Note que this.sharedService.collectionAux precisa estar definido corretamente
          // no SharedService para o contexto atual (e.g., 'clientes', 'nutricionistas').
          return this.getUserData(user.uid, this.sharedService.collectionAux).pipe(
            switchMap((userData: any) => {
              if (userData) {
                // Combina dados do Auth com dados do Firestore
                const userWithRole = { uid: user.uid, email: user.email, ...userData };
                return of(userWithRole);
              } else {
                console.log('Nenhum dado de usuário encontrado no Firestore para o UID:', user.uid);
                // Retorna o usuário base do Auth se não encontrar dados no Firestore,
                // para não perder a informação de que o usuário está logado.
                return of({ uid: user.uid, email: user.email, role: 'unknown' }); 
              }
            }),
            catchError(error => {
              console.error('Erro ao buscar dados adicionais do usuário no Firestore:', error);
              // Em caso de erro na busca do Firestore, ainda retorna o usuário base
              // para não bloquear o acesso se a autenticação estiver ok.
              return of({ uid: user.uid, email: user.email, role: 'error' });
            })
          );
        } else {
          console.log('Usuário não autenticado.');
          return of(null);
        }
      })
    );
  }

  // >>>>> ESSA É A ÚNICA ALTERAÇÃO NECESSÁRIA PARA O PROFISSIONALCOMPONENT <<<<<
  // Renomeamos para 'currentUser$' para maior clareza, mas é a mesma 'user$'
  // que você já tinha. O 'ProfissionalComponent' vai se inscrever nela.
  getCurrentUserObservable(): Observable<User | null> {
    // Retorna o Observable original de authState para compatibilidade e clareza
    // ou você pode retornar this.user$ se preferir que ele já venha com os dados adicionais.
    // Para o propósito de pegar o UID, o authState direto é mais limpo.
    return authState(this.auth); 
  }

  // Se você precisa do objeto User completo com o role, o ProfissionalComponent pode se inscrever em this.user$
  // Exemplo de como usar no ProfissionalComponent:
  // this.authService.user$.subscribe(userWithRole => { /* ... */ });
  // Mas para pegar APENAS o UID inicial, getCurrentUserObservable é mais direto.


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

        // Ajuste aqui: use a coleção 'users' para buscar o papel principal.
        // ou a SharedService.collectionAux se você já define ela antes do login.
        const userDocRef = doc(this.firestore, 'users', user.uid); 
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const role = userDocSnap.data()['role'];
          // Antes de redirecionar, você precisa definir sharedService.collectionAux
          // para que o user$ no construtor do AuthService saiba onde buscar
          // os dados do usuário.
          this.sharedService.collectionAux = this.getCollectionByRole(role);
          
          this.redirectUserByRole(role, user.uid);
        } else {
          console.error('Usuário não encontrado na coleção "users".');
          // Lidar com o caso de usuário autenticado mas sem role definido no Firestore
          // Talvez redirecionar para uma página de "configuração de perfil"
        }
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error; // Propagar o erro para o componente que chamou
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
        // Garante que o usuário também seja registrado na coleção 'users' para ter o papel principal
        await setDoc(doc(this.firestore, 'users', uid), { nome, numeroTelefone, email, role });

        // Ajuste sharedService.collectionAux após o registro para que o user$ saiba onde buscar
        this.sharedService.collectionAux = collectionName;

        //await this.processPayment(paymentData, uid);
        this.redirectUserByRole(role, uid);
      }
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error; // Propagar o erro para o componente que chamou
    }
  }

 /* private processPayment(paymentData: any, uid: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.paymentService.createCardHash(paymentData).then(cardHash => {
        this.paymentService.processPayment({ ...paymentData, cardHash }).subscribe({
          next: () => resolve(),
          error: error => reject(error)
        });
      }).catch(error => reject(error));
    });
  }*/

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
      // Limpar collectionAux no sharedService ao deslogar
      this.sharedService.collectionAux = ''; // Ou defina para um valor padrão
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error; // Propagar o erro para o componente que chamou
    }
  }
}