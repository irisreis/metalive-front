import { Component, OnInit } from "@angular/core";
import { PaymentService } from "../../payment.service";
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Adicione esta linha

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

  // Método para processar o pagamento
  processarPagamento() {
    console.log('Iniciando processamento de pagamento...');

    // Enviar os dados do cartão para o backend para gerar o card_hash
    this.paymentService.gerarCardHash(this.paymentData).subscribe(
      (cardHash) => {
        console.log('Card Hash gerado:', cardHash);
        
        const paymentDataComHash = {
          amount: this.paymentData.amount, // valor em centavos
          card_hash: cardHash // Inclua o card_hash retornado
        };

        // Enviar o card_hash para o backend para processar o pagamento
        this.paymentService.processPayment(paymentDataComHash).subscribe(
          response => {
            console.log('Resposta da API:', response); // Verifique a resposta da API
          },
          error => {
            console.error('Erro ao processar pagamento:', error); // Verifique erros
          }
        );
      },
      error => {
        console.error('Erro ao gerar card_hash:', error); // Erro ao gerar card_hash
      }
    );
  }
}
