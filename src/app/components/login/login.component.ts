import { Component, inject, TemplateRef } from '@angular/core';
import { Auth, sendPasswordResetEmail, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastComponent } from '../toast/toast.component';
import { AppToastService } from '../../services/toast.service';

declare const bootstrap: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgbModule, ToastComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private auth: Auth = inject(Auth);
  email = '';
  password = '';
  showToast = false;
  toastService = inject(AppToastService);

  constructor(private router: Router) {}

  showSuccess(title: string, message: string) {
		this.toastService.show(title, message, 'bg-success text-light');
	}

	showDanger(title: string, message: string) {
		this.toastService.show(title, message, 'bg-danger text-light');
	}

  login() {
     signInWithEmailAndPassword(this.auth, this.email, this.password).then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      this.showSuccess('Sucesso!', 'Login efetuado com sucesso!')
      localStorage.setItem('user', JSON.stringify(user))
      setTimeout(() => {
        this.router.navigateByUrl('/');
      }, 2000);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode);
      console.error(errorMessage);
      if (errorCode == 'auth/invalid-credential') {
        this.showDanger('Erro.', 'E-mail ou senha inválidos.')
      }
    });
  }

  resetPassword() {
    sendPasswordResetEmail(this.auth, this.email).then(() => {
      this.showSuccess('Sucesso!', 'E-mail de redefinição de senha enviado! Lembre-se de verificar as caixas de spam do e-mail.')
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == 'auth/user-not-found') {
        this.showDanger('Erro.', 'Nenhum usuário cadastrado com esse e-mail.');
      }
      if (errorCode == 'auth/invalid-email') {
        this.showDanger('Erro.', 'E-mail inválido.');
      }
    });
  }
}
