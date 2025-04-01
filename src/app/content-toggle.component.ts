import { Component } from '@angular/core';

@Component({
  selector: 'app-content-toggle',
  standalone: true,
  templateUrl: './content-toggle.component.html',
  styleUrls: ['./content-toggle.component.css']
})
export class ContentToggleComponent {
  activeTab: string = 'profissional'; // Define o conteúdo inicial a ser exibido

  setActive(tab: string): void {
    this.activeTab = tab; // Atualiza a aba ativa com base no link clicado
  }
}
