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

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    console.log('CadastroComponent Initialized');
  }

  // Método que será chamado ao submeter o formulário
  onSubmit() {
    this.authService.register(this.email, this.password, this.repeatPassword, this.role, this.paymentData)
      .then(() => {
        console.log('Cadastro e pagamento efetuados com sucesso!');
        this.router.navigate(['/perfil']);
      })
      .catch((error) => {
        console.error('Erro ao cadastrar e processar pagamento:', error);
        alert(error.message); // Mostra a mensagem de erro para o usuário
      });
  }
}
