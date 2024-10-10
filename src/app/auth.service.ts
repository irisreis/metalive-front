import { Injectable } from "@angular/core";
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  authState,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of, from } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { SharedService } from '../app/services/shared.service'; // Ajuste o caminho conforme necessário
import { PaymentService } from './payment.service'; // Certifique-se de importar o PaymentService

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
      switchMap(user => {
        if (user) {
          console.log('Usuário autenticado:', user.uid);
          return this.getUserData(user.uid, this.sharedService.collectionAux).pipe(
            switchMap(userData => {
              if (userData) {
                return { uid: user.uid, email: user.email, ...userData };
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

  getUserData(uid: string, collection: string): Observable<any> {
    const userDocRef = doc(this.firestore, `${collection}/${uid}`);
    return from(getDoc(userDocRef)).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          return docSnap.data();
        } else {
          return null; // Retorna null se o documento não existir
        }
      }),
      catchError(error => {
        console.error('Erro ao buscar dados do Firestore:', error);
        return of(null); // Retorna um observable vazio em caso de erro
      })
    );
  }
  

  getCollectionByRole(role: string): string {
    switch (role.toLowerCase()) {
      case 'nutricionista':
        return 'nutricionistas';
      case 'personal trainer':
        return 'personais';
      case 'cliente':
        return 'clientes';
      default:
        return 'users'; // Retorna uma coleção padrão
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem('token', token); // Armazena o token do Firebase

        const userDocRef = doc(this.firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const role = userData['role'];

          console.log('Usuário logado com o papel:', role);
          // Redirecionar com base no papel
          this.redirectUserByRole(role, user.uid);
        } else {
          console.error('Usuário não encontrado na coleção "users".');
        }
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }

  async register(email: string, password: string, repeatPassword: string, role: string, paymentData: any): Promise<void> {
    try {
      // Validação de senhas
      if (password !== repeatPassword) {
        throw new Error('As senhas não correspondem.');
      }

      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user?.uid;

      if (uid) {
        const collectionName = this.getCollectionByRole(role);
        const userDocRefInRoleCollection = doc(this.firestore, collectionName, uid);

        await setDoc(userDocRefInRoleCollection, {
          email: email,
          role: role,
        });

        const userDocRefInUsersCollection = doc(this.firestore, 'users', uid);
        await setDoc(userDocRefInUsersCollection, {
          email: email,
          role: role,
        });

        console.log(`Usuário salvo com sucesso nas coleções ${collectionName} e users.`);

        // Processa o pagamento após o cadastro
        await this.processPayment(paymentData, uid);

        // Redireciona o usuário com base no papel
        this.redirectUserByRole(role, uid);
      }
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      //alert(error.message); // Mostra a mensagem de erro para o usuário
    }
  }

  private async processPayment(paymentData: any, uid: string): Promise<void> {
    try {
      const cardHash = await this.paymentService.gerarCardHash(paymentData);
      console.log('Card hash gerado:', cardHash);
      
      const paymentResponse = await this.paymentService.processPayment({ ...paymentData, cardHash });
      console.log('Pagamento processado com sucesso:', paymentResponse);
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento.'); // Mostra a mensagem de erro para o usuário
    }
  }

  private redirectUserByRole(role: string, uid: string): void {
    switch (role.toLowerCase()) {
      case 'nutricionista':
        this.router.navigate(['/nutricionista', uid]);
        break;
      case 'cliente':
        this.router.navigate(['/perfil', uid]);
        break;
      case 'personal trainer':
        this.router.navigate(['/personal', uid]);
        break;
      default:
        console.error('Papel de usuário não reconhecido:', role);
        break;
    }
  }
}
