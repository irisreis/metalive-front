import { Component, inject } from "@angular/core";
import { Auth, createUserWithEmailAndPassword } from "@angular/fire/auth";
import { Firestore, doc, setDoc } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-cadastro-colaborador",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./cadastro-colaborador.component.html",
  styleUrls: ["./cadastro-colaborador.component.scss"]
})
export class CadastroColaboradorComponent {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);

  email = "";
  password = "";
  repeatPassword = "";
  role: string = '';
  nome: string = '';
  numeroTelefone: string = '';

  cadastrar() {
    if (this.password !== this.repeatPassword) {
      alert("As senhas precisam ser iguais.");
      return;
    }

    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;

        // Salvando dados adicionais no Firestore
        await setDoc(doc(this.firestore, 'users', uid), {
          email: this.email,
          role: this.role,
          nome: this.nome,
          numeroTelefone: this.numeroTelefone,
        });

        // Redirecionamento após o cadastro
        switch (this.role) {
          case 'nutricionista':
            this.router.navigate(['/nutricionista-dashboard']);
            break;
          case 'personal':
            this.router.navigate(['/personal-dashboard']);
            break;
          default:
            this.router.navigate(['/perfil']);
        }

        alert("Cadastro efetuado com sucesso!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === "auth/email-already-in-use") {
          alert("Este e-mail já está cadastrado.");
        } else if (errorCode === "auth/weak-password") {
          alert("A senha precisa ter 6 ou mais caracteres.");
        }
      });
  }
}
