import { Component, OnInit } from "@angular/core";
import { PaymentService } from "../../payment.service";
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { HttpClient } from "@angular/common/http"; // Certifique-se de que isso é importado apenas no serviço
import { Observable } from "rxjs"; // Certifique-se de que isso é importado apenas no serviço

@Component({
  selector: "app-dados-pagamento",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./dados-pagamento.component.html",
  styleUrls: ["./dados-pagamento.component.scss"] 
})

export class DadosPagamentoComponent implements OnInit {
  ngOnInit(): void {
    console.log('PagamentoComponent Initialized');
  }
  
  paymentData = {
    name: "",
    card_number: "",
    card_expiration_date: "",
    card_cvv: "",
    amount: 100
    //amount: 15600 // valor em centavos
  };

  constructor(private paymentService: PaymentService) {
    console.log('DadosPagamentoComponent Constructor');

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

  onSubmit() {
    this.paymentService.createTransaction(this.paymentData)
      .subscribe(
        (response) => console.log("Transação bem-sucedida!", response),
        (error) => console.error("Erro na transação", error)
      );
  }
}
