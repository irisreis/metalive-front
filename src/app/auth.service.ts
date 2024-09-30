import { Injectable } from "@angular/core";
import { Auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, authState } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of, from } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { SharedService } from '../app/services/shared.service'// Ajuste o caminho conforme necessário


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Observable para o estado do usuário autenticado com dados do Firestore
  user$: Observable<any>;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private sharedService: SharedService
  ) {
    // Inicializando o observable do estado de autenticação do Firebase e carregando os dados do Firestore
    this.user$ = authState(this.auth).pipe(
      switchMap(user => {
        if (user) {
          console.log('aquiiiiiiiiiiiiiii::::');
          // Obtém o documento do usuário no Firestore usando a coleção padrão 'users'
          return this.getUserData(user.uid, this.sharedService.collectionAux).pipe(
            switchMap(userData => {
              if (userData) {
                // Define a coleção correta com base no papel do usuário
                const collectionName = this.getCollectionByRole(userData.role);
                console.log('o userdata.role e ::::'+collectionName);
                // Busca os dados na coleção correta
                return this.getUserData(user.uid, collectionName).pipe(
                  map(docSnapshot => {
                    if (docSnapshot) {
                      return { uid: user.uid, email: user.email, ...docSnapshot };
                    } else {
                      return null;
                    }
                  })
                );
              } else {
                return of(null);
              }
            })
          );
        } else {
          return of(null);  // Retorna null se não estiver logado
        }
      })
    );
  }

  // Método para buscar o documento do usuário em uma coleção específica
  getUserData(uid: string, collection: string): Observable<any> {
    const userDocRef = doc(this.firestore, `${collection}/${uid}`);
    console.log(`Tentando acessar o documento: ${userDocRef.path}`);
    return from(getDoc(userDocRef)).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          console.log('Documento Firestore encontrado:', docSnap.data());
          return docSnap.data();
        } else {
          console.log('Documento não encontrado na coleção:', collection);
          return null; // Certifique-se de retornar null
        }
      }),
      catchError(error => {
        console.error('Erro ao buscar dados do Firestore:', error);
        return of(null); // Retorne null em caso de erro
      })
    );
  }
  // Método para obter a coleção correta com base no papel do usuário
  getCollectionByRole(role: string): string {
    switch (role.toLowerCase()) {
      case 'nutricionista':
        return 'nutricionistas';
      case 'personal trainer':
        return 'personais';
      case 'cliente':
        return 'clientes';
      default:
        console.log('Role não reconhecida, usando coleção padrão "users".');
        return 'users'; // Retorna uma coleção padrão se a role não for reconhecida
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      // Faz o login no Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
  
      if (user) {
        // Buscar o documento do usuário na coleção "users"
        const userDocRef = doc(this.firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const role = userData['role'];  // Obtém o papel do usuário
  
          console.log('Usuário logado com o papel:', role);
  
          // Redirecionar com base no papel
          if (role.toLowerCase() === 'nutricionista') {
            this.router.navigate(['/nutricionista', user.uid]);
          } else if (role.toLowerCase() === 'cliente') {
            this.router.navigate(['/perfil', user.uid]);
          } else if (role.toLowerCase() === 'personal trainer') {
            this.router.navigate(['/personal', user.uid]);
          } else {
            console.error('Papel de usuário não reconhecido:', role);
            //this.router.navigate(['/not-found']);
          }
        } else {
          console.error('Usuário não encontrado na coleção "users".');
          //this.router.navigate(['/not-found']);
        }
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      //this.router.navigate(['/not-found']);
    }
  }
  

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }

  async register(email: string, password: string, role: string): Promise<void> {
    try {
      console.log('aq1');
      // Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user?.uid;
      console.log('o uid éeeeee: '+uid);
      if (uid) {
        // Salvar o usuário na coleção específica para seu papel
        console.log('aq2');
        const collectionName = this.getCollectionByRole(role);
        const userDocRefInRoleCollection = doc(this.firestore, collectionName, uid);

        await setDoc(userDocRefInRoleCollection, {
          email: email,
          role: role,
        });

        // Salvar o usuário também na coleção "users" (coleção geral)
        const userDocRefInUsersCollection = doc(this.firestore, 'users', uid);

        await setDoc(userDocRefInUsersCollection, {
          email: email,
          role: role,
        });

        console.log(`Usuário salvo com sucesso nas coleções ${collectionName} e users.`);

        // Redirecionar para o dashboard correto
        if (role.toLowerCase() === 'nutricionista') {
          this.router.navigate(['/nutricionista', uid]);
        } else if (role.toLowerCase() === 'cliente') {
          this.router.navigate(['/perfil',uid]);
        } else if (role.toLowerCase() === 'personal trainer') {
          this.router.navigate(['/personal',uid]);
        }
      }
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
    }
  }
}
