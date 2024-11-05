import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importando FormsModule

@Component({
  selector: 'app-chat',
  standalone: true, // Certifique-se de que o componente é standalone
  imports: [FormsModule], // Adicionando FormsModule aqui
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent{
 /* message: string = ''; // Armazenar a mensagem atual

  @Input() senderId!: string; // ID do remetente (nutricionista)
  @Input() receiverId!: string; // ID do destinatário (cliente)

  // Função para enviar mensagem
  sendMessage(senderId: string, receiverId: string) {
    if (!this.message || !this.senderId || !this.receiverId) {
      console.error('Erro: Dados incompletos para envio da mensagem.');
      return;
    }

    // Aqui você colocaria a lógica para salvar a mensagem no Firestore ou fazer o que for necessário
    console.log(`Mensagem enviada de ${this.senderId} para ${this.receiverId}: ${this.message}`);
    this.message = ''; // Limpa o campo de mensagem após o envio
  }*/
}
