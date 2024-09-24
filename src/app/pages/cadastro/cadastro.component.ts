import { Component, inject } from "@angular/core";
import { Auth, createUserWithEmailAndPassword } from "@angular/fire/auth";
import { Firestore, doc, setDoc } from "@angular/fire/firestore";
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
  role: string = 'cliente';
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

        // Definindo a coleção com base na role
        let collectionName = '';
        switch (this.role) {
          case 'cliente':
            collectionName = 'clientes';
            break;
          default:
            collectionName = 'clientes';
        }

        // Salvando dados adicionais no Firestore na coleção correta
        await setDoc(doc(this.firestore, collectionName, uid), {
          role: this.role,
          email: this.email,
          nome: this.nome,
          numeroTelefone: this.numeroTelefone,
        });

        alert("Cadastro efetuado com sucesso!");
        // Redirecionando após o cadastro
        this.router.navigate(['/perfil']);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === "auth/email-already-in-use") {
          alert("Este e-mail já está cadastrado.");
        } else if (errorCode === "auth/weak-password") {
          alert("A senha precisa ter 6 ou mais caracteres.");
        } else {
          alert("Erro ao cadastrar: " + errorMessage);
        }
      });
  }
}
