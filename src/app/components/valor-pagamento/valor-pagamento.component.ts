// produto.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html'
})
export class ProdutoComponent {
  valorProduto = 156; // Valor do produto

  constructor(private router: Router) {}

  irParaPagamento() {
    this.router.navigate(['/pagamento'], { state: { valor: this.valorProduto } });
  }
}
