import { Component, OnInit } from "@angular/core";
import { PaymentService } from "../../payment.service";
import { FormsModule } from '@angular/forms';
import pagarme from 'pagarme'; // Certifique-se de que o SDK está instalado

@Component({
  selector: "app-dados-pagamento",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./dados-pagamento.component.html",
  styleUrls: ["./dados-pagamento.component.scss"] 
})
export class DadosPagamentoComponent implements OnInit {

  paymentData = {
    name: "",
    card_number: "",
    card_expiration_date: "",
    card_cvv: "",
    amount: 15600 // valor em centavos (156 reais)
  };

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    console.log('DadosPagamentoComponent Initialized');
  }

  // Método para gerar o card_hash
  gerarCardHash(): Promise<string> {
    return pagarme.client.connect({ encryption_key: 'SUA_CHAVE_PUBLICA_AQUI' }) // Insira sua chave pública
      .then((client: any) => client.security.encrypt({
        card_number: this.paymentData.card_number,
        card_holder_name: this.paymentData.name,
        card_expiration_date: this.paymentData.card_expiration_date,
        card_cvv: this.paymentData.card_cvv
      }));
  }

  // Método para processar o pagamento
  processarPagamento() {
    console.log('Iniciando processamento de pagamento...');
    
    this.gerarCardHash().then(cardHash => {
      console.log('Card Hash gerado:', cardHash);
      
      const paymentDataComHash = {
        amount: this.paymentData.amount, // valor em centavos
        card_hash: cardHash
      };

      // Enviar o card_hash para o backend
      this.paymentService.processPayment(paymentDataComHash).subscribe(
        response => {
          console.log('Resposta da API:', response); // Verifique a resposta da API
        },
        error => {
          console.error('Erro ao processar pagamento:', error); // Verifique erros
        }
      );
    }).catch(error => {
      console.error('Erro ao gerar card_hash:', error); // Erro ao gerar card_hash
    });
  }
}
