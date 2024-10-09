import { Component, inject, OnInit } from "@angular/core";
import { Auth, createUserWithEmailAndPassword } from "@angular/fire/auth";
import { Firestore, doc, setDoc } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { PaymentService } from "../../payment.service";
import { FormsModule } from '@angular/forms';
import { DadosPagamentoComponent } from "../../components/dados-pagamento/dados-pagamento.component";
import { AuthService } from "../../auth.service"; // Importando AuthService

@Component({
  selector: "app-cadastro",
  standalone: true,
  imports: [FormsModule, DadosPagamentoComponent],
  templateUrl: "./cadastro.component.html",
  styleUrls: ["./cadastro.component.scss"]
})
export class CadastroComponent implements OnInit {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService); // Injeta AuthService
  private paymentService: PaymentService = inject(PaymentService); // Injeta PaymentService

  email = "";
  password = "";
  repeatPassword = "";
  role: string = 'cliente';
  nome: string = '';
  numeroTelefone: string = '';

  // Dados do pagamento
  paymentData = {
    name: "",
    card_number: "",
    card_expiration_date: "",
    card_cvv: "",
    billingAddress: "", // Adicionando o campo de endereço de cobrança
    amount: 15600 // valor em centavos (156 reais)
  };

  constructor() {}

  ngOnInit(): void {
    console.log('CadastroComponent Initialized');
  }

  // Método que será chamado ao submeter o formulário
  onSubmit() {
    // Chama o método de registro do AuthService
    this.authService.register(this.email, this.password, this.repeatPassword, this.role, this.paymentData)
      .then(async () => {
        console.log('Cadastro realizado com sucesso!');

        // Processando o pagamento após o cadastro
        try {
          const paymentResponse = await this.paymentService.processPayment(this.paymentData).toPromise();
          console.log('Pagamento processado com sucesso:', paymentResponse);

          // Navegando para o perfil após o pagamento
          this.router.navigate(['/perfil']);
        } catch (error) {
          console.error('Erro ao processar pagamento:', error);
          alert("Cadastro efetuado, mas erro ao processar pagamento.");
        }
      })
      .catch((error) => {
        console.error('Erro ao cadastrar e processar pagamento:', error);
        alert(error.message); // Mostra a mensagem de erro para o usuário
      });
  }
}
