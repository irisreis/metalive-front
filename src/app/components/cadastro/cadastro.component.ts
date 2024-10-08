import { Component, inject } from "@angular/core";
import { Auth, createUserWithEmailAndPassword } from "@angular/fire/auth";
import { Firestore, doc, setDoc } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AppToastService } from '../../services/toast.service'; // Ajuste o caminho conforme necessário
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
  nome: string = '';
  cpf: string = '';
  dataNascimento: string = '';
  sexo: string = '';
  numeroCelular: string = '';
  cep: string = '';
  rua: string = '';
  cidade: string = '';
  estado: string = '';
  complemento: string = '';
  constructor(private toastService: AppToastService) {}

  showSuccess(title: string, message: string) {
		this.toastService.show(title, message, 'bg-success text-light');
	}

	showDanger(title: string, message: string) {
		this.toastService.show(title, message, 'bg-danger text-light');
	}

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
          cpf: this.cpf,
          dataNascimento: this.dataNascimento,
          sexo: this.sexo,
          numeroCelular: this.numeroCelular,
          endereco: {
            cep: this.cep,
            rua: this.rua,
            cidade: this.cidade,
            estado: this.estado,
            complemento: this.complemento
          }
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
            this.router.navigate(['/paciente-dashboard']);
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
