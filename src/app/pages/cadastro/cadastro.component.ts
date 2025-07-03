import { Component, inject, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { Firestore } from "@angular/fire/firestore";
import { Router, RouterModule } from "@angular/router"; // Importar RouterModule para o template
//import { PaymentService } from "../../payment.service"; // Mantido comentado se não estiver em uso
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Necessário para ngIf, ngFor, etc.
import { AuthService } from "../../auth.service";
import { ScrollService } from "../../scroll.service";
import { HeaderComponent } from "../../components/header/header.component";
//import { firstValueFrom } from 'rxjs'; // Mantido comentado se paymentService não estiver em uso

@Component({
  selector: "app-cadastro",
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, HeaderComponent], // Adicionado CommonModule e RouterModule
  templateUrl: "./cadastro.component.html",
  styleUrls: ["./cadastro.component.scss"]
})
export class CadastroComponent implements OnInit, AfterViewInit {
  @ViewChild("destinoDetalhePagamento") destinoDetalhePagamento!: ElementRef; // Para rolagem
  
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  //private paymentService: PaymentService = inject(PaymentService); // Descomente se for usar o Pagar.me
  private scrollService: ScrollService = inject(ScrollService);

  // Dados do formulário de cadastro
  email: string = "";
  password: string = "";
  repeatPassword: string = "";
  role: string = 'cliente'; // Default 'cliente' conforme sua lógica
  nome: string = '';
  numeroTelefone: string = '';

  // Dados do cartão de crédito (para vincular aos inputs)
  card_name: string = ''; // Nome no cartão
  card_number: string = '';
  card_expiration_date: string = ''; // MM/AA
  card_cvv: string = '';
  billingAddress: string = ''; // Endereço de cobrança (mapeado para o campo 'address' no HTML)

  // Dados de pagamento (estrutura para o Pagar.me ou similar)
  paymentData = {
    amount: 15990, // Valor em centavos (R$ 159,90)
    currency: "BRL",
    paymentMethod: "credit_card", // Assume cartão de crédito por padrão
    card: {
      name: "",
      card_number: "",
      card_expiration_date: "",
      card_cvv: "",
      billingAddress: "",
      card_hash: "", // Será gerado pelo SDK do Pagar.me
    },
  };

  aceito: boolean = false; // Checkbox de termos e condições

  // Flags para controle de UI/UX (opcional, adicione mais se precisar de spinners, etc.)
  isLoading: boolean = false;
  
  // Para controlar o método de pagamento selecionado
  selectedPaymentMethod: 'credit_card' | 'pix' | 'boleto' = 'credit_card';

  ngOnInit(): void {
    // Inicialize valores padrão se necessário
    // this.email = "seu.email@example.com";
  }

  ngAfterViewInit() {
    this.scrollService.getRolagemObservable().subscribe((idElemento: any) => {
      console.log("Recebido pedido de rolagem para:", idElemento);
      // Aqui você precisaria ter um ID no seu HTML para o destino do scroll
      // Ex: <div id="detalhes-pagamento" #destinoDetalhePagamento>
      if (this.destinoDetalhePagamento?.nativeElement && this.destinoDetalhePagamento.nativeElement.id === idElemento) {
        this.destinoDetalhePagamento.nativeElement.scrollIntoView({ behavior: "smooth" });
      } else {
        console.warn(`Elemento de destino com ID '${idElemento}' não encontrado ou não inicializado.`);
      }
    });
  }

  // Método para alternar o método de pagamento
  selectPaymentMethod(method: 'credit_card' | 'pix' | 'boleto'): void {
    this.selectedPaymentMethod = method;
    this.paymentData.paymentMethod = method; // Atualiza no objeto de dados de pagamento
    console.log('Método de pagamento selecionado:', this.selectedPaymentMethod);
  }

  async onSubmit() {
    this.isLoading = true; // Inicia o carregamento

    if (!this.aceito) {
      alert("Para cadastrar, você precisa aceitar os termos de uso e privacidade.");
      this.isLoading = false;
      return;
    }

    // Validações básicas de formulário (você pode usar Reactive Forms para validações mais robustas)
    if (!this.nome || !this.email || !this.password || !this.repeatPassword || !this.numeroTelefone) {
      alert("Por favor, preencha todos os dados pessoais e de contato.");
      this.isLoading = false;
      return;
    }
    if (this.password !== this.repeatPassword) {
      alert("A senha e a confirmação de senha não coincidem.");
      this.isLoading = false;
      return;
    }

    // Atribui os dados do cartão ao objeto paymentData
    this.paymentData.card = {
      name: this.card_name,
      card_number: this.card_number,
      card_expiration_date: this.card_expiration_date,
      card_cvv: this.card_cvv,
      billingAddress: this.billingAddress,
      card_hash: "", // Será preenchido pelo SDK do Pagar.me se o PaymentService for usado
    };

    try {
      // 1. Gerar o card_hash (Se PaymentService estiver ativo)
      /*
      if (this.paymentService) {
        const cardHashResponse = await firstValueFrom(this.paymentService.gerarCardHash(this.paymentData.card));
        if (cardHashResponse?.card_hash) {
          this.paymentData.card.card_hash = cardHashResponse.card_hash;
        } else {
          throw new Error("Falha ao gerar o card_hash.");
        }
      }
      */

      // 2. Registrar o usuário no Firebase Auth e Firestore
      await this.authService.register(
        this.nome,
        this.numeroTelefone,
        this.email,
        this.password,
        this.repeatPassword, // O AuthService provavelmente valida a repetição
        this.role,
        // O paymentData completo será passado no register para que o AuthService salve no Firestore
        // ou você pode ter uma função separada para salvar os dados de pagamento APÓS o registro.
        // Se o AuthService não lida com paymentData, você deve salvar isso separadamente aqui.
        this.paymentData
      );
      console.log('Cadastro de usuário realizado com sucesso!');
      alert('Cadastro realizado com sucesso!'); // Feedback ao usuário

      // 3. Processar o pagamento
      await this.processPayment(); // Chamada para o método de processamento de pagamento
      
    } catch (error: any) {
      console.error('Erro no cadastro ou pagamento:', error);
      alert(error.message || 'Ocorreu um erro no cadastro ou pagamento. Por favor, tente novamente.');
    } finally {
      this.isLoading = false; // Finaliza o carregamento
    }
  }

  private async processPayment() {
    try {
      // DESCOMENTE e ajuste esta parte se estiver usando o PaymentService
      /*
      if (this.paymentService) {
        const paymentResponse = await firstValueFrom(this.paymentService.processPayment(this.paymentData));
        console.log('Pagamento processado com sucesso:', paymentResponse);
        alert('Pagamento processado com sucesso!');
        this.router.navigate(['/perfil']); // Redireciona para o perfil após sucesso
      } else {
        console.log('PaymentService não ativo. Simular sucesso de pagamento e redirecionar.');
        alert('Pagamento simulado com sucesso! Redirecionando para o perfil.');
        this.router.navigate(['/perfil']); // Redireciona mesmo sem PaymentService real
      }
      */
      // Para demonstração sem PaymentService real, vamos direto para o perfil
      alert('Cadastro e pagamento (simulado) concluídos! Redirecionando para o perfil.');
      this.router.navigate(['/perfil', this.auth.currentUser?.uid || '']); // Redireciona para o perfil do usuário logado
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      throw new Error('Falha no processamento do pagamento: ' + (error as Error).message); // Lança para ser pego pelo catch principal
    }
  }

  async onLogout() {
    try {
      await this.authService.logout();
      console.log('Usuário foi deslogado e redirecionado');
      this.router.navigate(['/login']); // Redireciona para a página de login
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  }

  // Métodos de rolagem (reutilizados do seu código)
  rolarParaDestino(event: Event, idElemento: string) {
    event.preventDefault();
    this.scrollService.emitirRolagem(idElemento);
  }
}