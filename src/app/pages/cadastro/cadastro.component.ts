import { Component, inject, OnInit, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { Firestore } from "@angular/fire/firestore";
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from "../../auth.service";
import { ScrollService } from "../../scroll.service";
import { HeaderComponent } from "../../components/header/header.component";
import { firstValueFrom } from 'rxjs'; // Importação que estava faltando

declare var MercadoPago: any;

@Component({
  selector: "app-cadastro",
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, HeaderComponent],
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
  private scrollService: ScrollService = inject(ScrollService);

  // Propriedades do formulário (usadas com ngModel)
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
  isLoading: boolean = false;

  // Variáveis do Mercado Pago
  mercadopago: any;
  cardForm: any;

  ngOnInit(): void {}

  // Lógica do Mercado Pago e da rolagem, agora no lugar certo
  ngAfterViewInit() {
    // Inicialização da SDK do Mercado Pago
    const mp = new MercadoPago('', { locale: 'pt-BR' });

    this.cardForm = mp.cardForm({
      amount: '1.00',
      autoMount: false,
      form: {
        id: 'form-checkout',
        cardNumber: { id: 'cardNumber', placeholder: 'Número do cartão' },
        expirationDate: { id: 'expirationDate', placeholder: 'MM/YY' },
        securityCode: { id: 'securityCode', placeholder: 'CVV' },
        cardholderName: { id: 'cardholderName', placeholder: 'Titular do cartão' },
        cardholderEmail: { id: 'cardholderEmail', placeholder: 'E-mail' },
        issuer: { id: 'issuer', placeholder: 'Banco Emissor' },
        installments: { id: 'installments', placeholder: 'Parcelas' }
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
          console.log(`Buscando recurso "${resource}"`);
        }
      }
    });
    this.cardForm.mount();

    // Lógica de rolagem
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

  private validarCampos(): string | null {
    if (!this.nome.trim()) return "O campo Nome é obrigatório.";
    if (!this.cardholderEmail.trim()) return "O campo E-mail é obrigatório.";
    if (!this.password) return "O campo Senha é obrigatório.";
    if (!this.repeatPassword) return "O campo Confirmar Senha é obrigatório.";
    if (!this.cardholderName.trim()) return "O campo Nome no Cartão é obrigatório.";
    if (this.password !== this.repeatPassword) return "Senha e confirmação de senha não conferem.";
    return null;
  }

  // Método de submissão do formulário
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
    this.isLoading = true;
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

      const response = await fetch("https://confirmarpagamento-sjlgvpsoea-uc.a.run.app", { //substituir
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
    } finally {
      this.isLoading = false;
    }
  }

  // Método para deslogar (agora no lugar correto na classe)
  async onLogout() {
    try {
      await this.authService.logout();
      console.log('Usuário foi deslogado e redirecionado');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  }

  // Método de rolagem (agora no lugar correto na classe)
  rolarParaDestino(event: Event, idElemento: string) {
    event.preventDefault();
    this.scrollService.emitirRolagem(idElemento);
  }
}