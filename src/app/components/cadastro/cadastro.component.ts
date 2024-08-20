import { Component, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { AppToastService } from '../../services/toast.service';
import { ToastComponent } from '../toast/toast.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, ToastComponent],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  toastService = inject(AppToastService);
  email = '';
  password = '';
  repeatPassword = '';

  constructor(private router: Router) {}

  showSuccess(title: string, message: string) {
		this.toastService.show(title, message, 'bg-success text-light');
	}

	showDanger(title: string, message: string) {
		this.toastService.show(title, message, 'bg-danger text-light');
	}

  cadastrar() {
    if (this.password !== this.repeatPassword) {
      this.showDanger('Erro.', 'As senhas precisam ser iguais.');
      return;
    }
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user)
        if (user) {
          const userRef = doc(this.firestore, `users/${user.uid}`);
          const userData = {
            uid: user.uid,
            email: user.email
          };
          await setDoc(userRef, userData);
          localStorage.setItem('user', JSON.stringify(user))
          this.showSuccess('Sucesso!', 'Cadastro efetuado com sucesso! Redirecionando para o formulário.');
          setTimeout(() => {
            this.router.navigateByUrl('/formulario');
          }, 2000);
        }
        this.showSuccess('Sucesso!', 'Cadastro efetuado com sucesso!')
        return;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage);
        console.error(errorCode);
        if (errorCode == 'auth/email-already-in-use') {
          this.showDanger('Erro.', 'Este e-mail já está cadastrado.')
        }
        if (errorCode == 'auth/weak-password') {
          this.showDanger('Erro.', 'A senha precisa ter 6 ou mais caracteres.')
        }
      });
  }
}
