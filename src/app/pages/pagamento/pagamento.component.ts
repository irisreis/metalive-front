import { Component } from '@angular/core';
import { DadosPagamentoComponent } from '../../components/dados-pagamento/dados-pagamento.component';

@Component({
  selector: 'app-pagamento',
  standalone: true,
  imports: [DadosPagamentoComponent],
  templateUrl: './pagamento.component.html',
  styleUrl: './pagamento.component.scss'
})
export class PagamentoComponent {

}
