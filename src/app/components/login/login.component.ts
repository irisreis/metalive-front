import { Component, inject } from '@angular/core';
import { Auth, sendPasswordResetEmail, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private auth: Auth = inject(Auth);
  email = '';
  password = '';

  constructor(private router: Router) {}

  login() {
     signInWithEmailAndPassword(this.auth, this.email, this.password).then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      alert('Login efetuado com sucesso!');
      this.router.navigateByUrl('/');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode);
      console.error(errorMessage);
      if (errorCode == 'auth/invalid-credential') {
        alert('E-mail ou senha inválidos.');
      }
    });
  }

  resetPassword() {
    sendPasswordResetEmail(this.auth, this.email).then(() => {
      alert('E-mail de redefinição de senha enviado! Lembre-se de verificar as caixas de spam do e-mail.');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == 'auth/user-not-found') {
        alert('Nenhum usuário cadastrado com esse e-mail.');
      }
      if (errorCode == 'auth/invalid-email') {
        alert('E-mail inválido.');
      }
    });
  }
}
