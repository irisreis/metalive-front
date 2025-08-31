import { Component, inject, OnInit, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { Firestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
//import { PaymentService } from "../../payment.service";
import { FormsModule } from '@angular/forms';
import { AuthService } from "../../auth.service";
import { ScrollService } from "../../scroll.service";
import { firstValueFrom } from 'rxjs';

declare var MercadoPago: any;

@Component({
  selector: "app-cadastro",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./cadastro.component.html",
  styleUrls: ["./cadastro.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class CadastroComponent implements OnInit, AfterViewInit {
  @ViewChild("destinoDetalhePagamento") destinoDetalhePagamento!: ElementRef;

  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  //private paymentService: PaymentService = inject(PaymentService);
  private scrollService: ScrollService = inject(ScrollService);

  cardholderEmail = "";
  password = "";
  repeatPassword = "";
  role: string = 'cliente';
  nome: string = '';
  numeroTelefone: string = '';
  cardholderName: string = '';
  cardNumber: string = '';
  expirationDate: string = '';
  securityCode: string = '';
  billingAddress: string = '';

  aceito: boolean = false;

  mercadopago: any;
  cardForm: any;

  ngOnInit(): void {
  }

  private validarCampos(): string | null {
    if (!this.nome.trim()) return "O campo Nome é obrigatório.";
    if (!this.cardholderEmail.trim()) return "O campo E-mail é obrigatório.";
    if (!this.password) return "O campo Senha é obrigatório.";
    if (!this.repeatPassword) return "O campo Confirmar Senha é obrigatório.";
    if (!this.cardholderName.trim()) return "O campo Nome no Cartão é obrigatório.";
    if (!this.cardNumber.trim()) return "O campo Número do Cartão é obrigatório.";
    if (!this.expirationDate.trim()) return "O campo Validade do Cartão é obrigatório.";
    if (!this.securityCode.trim()) return "O campo CVV é obrigatório.";

    // Valida se senha e confirmação são iguais
    if (this.password !== this.repeatPassword) return "Senha e confirmação de senha não conferem.";

    return null; // sem erros
  }

  validarFormulario() {
    if (!this.aceito) {
      alert("Para cadastrar precisa aceitar os termos de uso e privacidade.");
      return;
    }

    const erroValidacao = this.validarCampos();
    if (erroValidacao) {
      alert(erroValidacao);
      return;
    }

    this.cardForm.submit();
  }

  private async processPayment(token: string, paymentMethodId: string, installments: string, issuerId: string) {
    // Aqui você pode mostrar um loader enquanto carrega o pagamento no backend
    try {
      const payload = {
        token,
        paymentMethodId,
        installments,
        issuerId,
        email: this.cardholderEmail,
        nome: this.nome,
        password: this.password,
        billingAddress: this.billingAddress,
        numeroTelefone: this.numeroTelefone,
      };

      const response = await fetch("https://us-central1-metalive-8b9e7.cloudfunctions.net/confirmarPagamento", { // tem que substituir pelo domínio correto do metalive
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        alert("Pagamento processado com sucesso!");
        this.router.navigate(['/perfil']);
      } else {
        throw new Error(result.message || "Erro ao processar o pagamento.");
      }
    } catch (error) {
      console.error("Erro na função processPayment:", error);
      alert((error as Error).message);
    }
  }

  async onLogout() {
    try {
      await this.authService.logout();
      console.log('Usuário foi deslogado e redirecionado');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  }

  rolarParaDestino(event: Event, idElemento: string) {
    event.preventDefault();
    this.scrollService.emitirRolagem(idElemento);
  }

  ngAfterViewInit() {
    const mp = new MercadoPago('APP_USR-f6a9189a-f359-4fcd-a8c7-f61f722748ea', { locale: 'pt-BR' }); // Substitua pela sua chave PÚBLICA do mercado pago

    this.cardForm = mp.cardForm({
      amount: '1.00',        // Deve ajustar o valor da transação
      autoMount: false,
      form: {
        id: 'form-checkout',

        cardNumber: {
          id: 'cardNumber',
          placeholder: 'Número do cartão'
        },
        expirationDate: {
          id: 'expirationDate',
          placeholder: 'MM/YY'
        },
        securityCode: {
          id: 'securityCode',
          placeholder: 'CVV'
        },
        cardholderName: {
          id: 'cardholderName',
          placeholder: 'Titular do cartão'
        },
        cardholderEmail: {
          id: 'cardholderEmail',
          placeholder: 'E-mail'
        },
        issuer: {
          id: 'issuer',
          placeholder: 'Banco Emissor'
        },
        installments: {
          id: 'installments',
          placeholder: 'Parcelas'
        }
      },

      callbacks: {
        onFormMounted: (error: any) => {
          if (error) {
            console.error('Erro ao montar o form:', error);
            return;
          }
          console.log('Formulário do mercadopago montado com sucesso');
        },
        onSubmit: async (event: any) => {
          event.preventDefault();

          try {
            const formData = this.cardForm.getCardFormData();

            await this.processPayment(formData.token, formData.paymentMethodId, formData.installments, formData.issuerId);

          } catch (err) {
            console.error('Erro no onSubmit:', err);
          }
        },
        onFetching: (resource: any) => {
          // Aqui você pode mostrar um loader enquanto carrega os dados buscados na api
          console.log(`Buscando recurso "${resource}"`);
        }
      }
    });
    this.cardForm.mount();

    this.scrollService.getRolagemObservable().subscribe((idElemento: any) => {
      console.log("Recebido pedido de rolagem para:", idElemento);
      if (this.destinoDetalhePagamento?.nativeElement) {
        if (this.destinoDetalhePagamento.nativeElement.id === idElemento) {
          this.destinoDetalhePagamento.nativeElement.scrollIntoView({ behavior: "smooth" });
        } else {
          console.log("IDs não coincidem. Verifique se o ID está correto.");
        }
      } else {
        console.log("Elemento de destino não encontrado ou não inicializado.");
      }
    });
  }
}