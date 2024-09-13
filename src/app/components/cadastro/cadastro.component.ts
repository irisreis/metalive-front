import { Component, inject } from "@angular/core";
import { Auth, createUserWithEmailAndPassword } from "@angular/fire/auth";
import { Firestore, collection, doc, setDoc } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-cadastro",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./cadastro.component.html",
  styleUrls: ["./cadastro.component.scss"]
})
export class CadastroComponent {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);

  email = "";
  password = "";
  repeatPassword = "";
  role: string = ''; // paciente, nutri ou personal

  cadastrar() {
    if (this.password !== this.repeatPassword) {
      alert("As senhas precisam ser iguais.");
      return;
    }

    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;

        // Salvar o role no Firestore
        await setDoc(doc(this.firestore, 'users', uid), {
          email: this.email,
          role: this.role
        });

        // Redirecionar para o dashboard correto
        switch (this.role) {
          case 'nutricionista':
            this.router.navigate(['/nutricionista-dashboard']);
            break;
          case 'personal':
            this.router.navigate(['/personal-dashboard']);
            break;
          default:
            this.router.navigate(['/paciente-dashboard']);
        }
        
        console.log(user);
        alert("Cadastro efetuado com sucesso!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage);
        console.error(errorCode);
        if (errorCode === "auth/email-already-in-use") {
          alert("Este e-mail já está cadastrado.");
        }
        if (errorCode === "auth/weak-password") {
          alert("A senha precisa ter 6 ou mais caracteres.");
        }
      });
  }
}
