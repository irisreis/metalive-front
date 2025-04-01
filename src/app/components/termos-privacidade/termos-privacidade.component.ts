import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-termos-privacidade',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './termos-privacidade.component.html',
  styleUrl: './termos-privacidade.component.scss'
})
export class TermosPrivacidadeComponent {
  aceito: boolean = false;

  // Você pode adicionar uma função para enviar o formulário somente se aceito for true
  confirmarAceite() {
    if (this.aceito) {
      alert('Termos aceitos');
      // Aqui você pode redirecionar ou fazer outras ações
    } else {
      alert('Você deve aceitar os Termos de Uso e a Política de Privacidade');
    }
  }
}
