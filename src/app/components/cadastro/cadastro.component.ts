import { Component, inject } from "@angular/core";
import { Auth, createUserWithEmailAndPassword } from "@angular/fire/auth";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-cadastro",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./cadastro.component.html",
  styleUrl: "./cadastro.component.scss"
})
export class CadastroComponent {
  private auth: Auth = inject(Auth);
  email = "";
  password = "";
  repeatPassword = "";

  cadastrar() {
    if (this.password !== this.repeatPassword) {
      alert("As senhas precisam ser iguais.");
      return;
    }
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        alert("Cadastro efetuado com sucesso!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage);
        console.error(errorCode);
        if (errorCode == "auth/email-already-in-use") {
          alert("Este e-mail já está cadastrado.");
        }
        if (errorCode == "auth/weak-password") {
          alert("A senha precisa ter 6 ou mais caracteres.");
        }
      });
  }
}
