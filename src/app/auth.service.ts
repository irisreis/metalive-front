import { Injectable } from "@angular/core";
import { Auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

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
          role: role // Adiciona o role (nutricionista ou paciente)
        });

        // Redirecionar para o dashboard correto
        if (role === 'nutricionista') {
          this.router.navigate(['/nutricionista-dashboard']);
        } else {
          this.router.navigate(['/paciente-dashboard']);
        }
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  }
}
