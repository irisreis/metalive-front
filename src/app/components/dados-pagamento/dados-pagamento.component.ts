import { Component, OnInit } from "@angular/core";
import { PaymentService } from "../../payment.service";
import { FormsModule } from '@angular/forms'; // Importar FormsModule

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
    console.log('Dados de pagamento:', this.paymentData); // Verifique os dados de pagamento
    this.paymentService.processPayment(this.paymentData).subscribe(
      response => {
        console.log('Resposta da API:', response); // Verifique a resposta da API
      },
      error => {
        console.error('Erro ao processar pagamento:', error); // Verifique erros
      }
    );
  }
}
