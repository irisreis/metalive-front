import { Component, inject } from "@angular/core";
import { Auth, sendPasswordResetEmail, signInWithEmailAndPassword } from "@angular/fire/auth";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"; // Se estiver usando o NgbModule em algum lugar para modais, etc.
import { ToastComponent } from "../../components/toast/toast.component";
import { AppToastService } from "../../services/toast.service";

@Component({
  selector: 'app-login-colaborador',
  templateUrl: './login-colaborador.component.html',
  styleUrls: ['./login-colaborador.component.scss'],
  standalone: true,
  imports: [FormsModule, ToastComponent, RouterModule, NgbModule] // Adicionado NgbModule
})
export class LoginColaboradorComponent {

  private auth: Auth = inject(Auth);
  role: string = ''; // nutri ou personal
  email: string = "";
  password: string = "";
  // showToast não é mais usado diretamente se você tem um AppToastService
  toastService = inject(AppToastService);

  constructor(private router: Router) {}

  showSuccess(title: string, message: string) {
    this.toastService.show(title, message, "bg-success text-light");
  }

  showDanger(title: string, message: string) {
    this.toastService.show(title, message, "bg-danger text-light");
  }

  // Métodos para controlar o estado do label do select (para fazer flutuar)
  onSelectFocus(): void {
    // O Angular gerencia bem o `select` com `ngModel` para a classe `ng-valid`, `ng-dirty`, etc.
    // Mas para o efeito de label flutuante com placeholder, a classe `has-value` ajuda.
  }

  onSelectBlur(): void {
    // O `[(ngModel)]` e `[class.has-value]="role !== ''"` já cuidam disso.
    // Este método pode ser vazio ou ter lógica adicional de validação.
  }


  async login() { // Use async/await para melhor legibilidade
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      const user = userCredential.user;
      console.log(user);
      this.showSuccess("Sucesso!", "Login efetuado com sucesso!");
      localStorage.setItem("user", JSON.stringify(user));

      setTimeout(() => {
        console.log("Função selecionada para login:", this.role);
        // Normaliza a role para evitar erros de case (maiúsculas/minúsculas)
        const normalizedRole = this.role.toLowerCase();

        if (normalizedRole === "nutricionista") {
          this.router.navigate([`/nutricionista`, user.uid]);
        } else if (normalizedRole === "personal trainer" || normalizedRole === "personal") { // Aceita "personal trainer" ou "personal"
          this.router.navigate([`/personal`, user.uid]);
        } else {
          console.error("Erro: Função selecionada inválida ou não reconhecida:", this.role);
          this.showDanger("Erro.", "Função selecionada inválida. Por favor, escolha Nutricionista ou Personal Trainer.");
          // Opcional: Redirecionar para uma página padrão de erro ou home se a role for inválida
          // this.router.navigate(['/']);
        }
      }, 2000);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Erro de autenticação:", errorCode, errorMessage); // Log mais detalhado

      if (errorCode === "auth/invalid-credential" || errorCode === "auth/user-not-found" || errorCode === "auth/wrong-password") {
        this.showDanger("Erro.", "E-mail ou senha inválidos."); // Mensagem genérica para segurança
      } else if (errorCode === "auth/invalid-email") {
        this.showDanger("Erro.", "Formato de e-mail inválido.");
      } else if (errorCode === "auth/too-many-requests") {
        this.showDanger("Erro.", "Muitas tentativas de login. Por favor, tente novamente mais tarde.");
      } else {
        this.showDanger("Erro.", "Ocorreu um erro inesperado. Por favor, tente novamente.");
      }
    }
  }

  async resetPassword() { // Use async/await
    if (!this.email) {
      this.showDanger("Erro.", "Por favor, insira um e-mail para redefinir a senha.");
      return;
    }

    try {
      await sendPasswordResetEmail(this.auth, this.email);
      this.showSuccess("Sucesso!", "E-mail de redefinição de senha enviado! Lembre-se de verificar as caixas de spam.");
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Erro ao redefinir senha:", errorCode, errorMessage);

      switch (errorCode) {
        case "auth/user-not-found":
          this.showDanger("Erro.", "Nenhum usuário cadastrado com esse e-mail.");
          break;
        case "auth/invalid-email":
          this.showDanger("Erro.", "E-mail inválido.");
          break;
        case "auth/too-many-requests":
          this.showDanger("Erro.", "Muitas tentativas. Tente novamente mais tarde.");
          break;
        default:
          this.showDanger("Erro.", "Ocorreu um erro ao enviar o e-mail de redefinição de senha. Por favor, tente novamente.");
          break;
      }
    }
  }
}