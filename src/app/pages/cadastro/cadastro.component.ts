import { Component, inject, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { Firestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { PaymentService } from "../../payment.service";
import { FormsModule } from '@angular/forms';
import { AuthService } from "../../auth.service"; 
import { ScrollService } from "../../scroll.service";
import { firstValueFrom } from 'rxjs';

@Component({
  selector: "app-cadastro",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./cadastro.component.html",
  styleUrls: ["./cadastro.component.scss"]
})
export class CadastroComponent implements OnInit, AfterViewInit {
  @ViewChild("destinoDetalhePagamento") destinoDetalhePagamento!: ElementRef;
  
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService); 
  private paymentService: PaymentService = inject(PaymentService);
  private scrollService: ScrollService = inject(ScrollService);

  email = "";
  password = "";
  repeatPassword = "";
  role: string = 'cliente';
  nome: string = '';
  numeroTelefone: string = '';
  card_number: string = '4111111111111111'; // Exemplo de cartão
  card_expiration_date: string = '12/25';
  card_cvv: string = '123';
  billingAddress: string = '';

  paymentData = {
    amount: 15600, // valor em centavos
    currency: "BRL",
    paymentMethod: "credit_card",
    card: {
      name: "",
      card_number: "",
      card_expiration_date: "",
      card_cvv: "",
      billingAddress: "",
      card_hash: "",
    },
  };
  
  aceito: boolean = false;

  ngOnInit(): void {}

  async onSubmit() {
    if (this.aceito) {
      try {
        this.paymentData.card = {
          name: this.nome,
          card_number: this.card_number,
          card_expiration_date: this.card_expiration_date,
          card_cvv: this.card_cvv,
          billingAddress: this.billingAddress,
          card_hash: "", 
        };
  
        // Gerando o card_hash com o SDK do Pagar.me
        const cardHashResponse = await firstValueFrom(this.paymentService.gerarCardHash(this.paymentData.card));
  
        if (cardHashResponse?.card_hash) {
          this.paymentData.card.card_hash = cardHashResponse.card_hash;
        } else {
          throw new Error("Falha ao gerar o card_hash.");
        }
  
        // Registrando o usuário
        await this.authService.register(this.nome, this.numeroTelefone, this.email, this.password, this.repeatPassword, this.role, this.paymentData);
        console.log('Cadastro realizado com sucesso!');
  
        // Processando o pagamento com o card_hash
        await this.processPayment();
        
      } catch (error) {
        console.error('Erro ao cadastrar:', error);
        alert((error as Error).message);
      }
    } else {
      alert("Para cadastrar precisa aceitar os termos de uso e privacidade.");
    }
  }
  
  private async processPayment() {
    try {
      const paymentResponse = await firstValueFrom(this.paymentService.processPayment(this.paymentData));
      console.log('Pagamento processado com sucesso:', paymentResponse);
      this.router.navigate(['/perfil']);
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
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
