import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Para usar [(ngModel)]
import { CommonModule } from '@angular/common'; // Para diretivas como ngIf
// Importe seu AppToastService se quiser usar toasts para feedback
// import { AppToastService } from '../../services/toast.service';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [CommonModule, FormsModule], // Adicione FormsModule
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.scss']
})
export class ContatoComponent implements OnInit {
  // Propriedades para vincular aos campos do formulário
  name: string = '';
  email: string = '';
  phone: string = '';
  message: string = '';

  isSending: boolean = false; // Flag para controlar o estado de envio

  // Injete seu ToastService se for usar
  // constructor(private toastService: AppToastService) { }
  constructor() { }

  ngOnInit(): void {
    // Inicialização do componente
  }

  /**
   * Envia o formulário de contato.
   * Em um ambiente real, esta função faria uma requisição HTTP para um backend.
   */
  async onSubmit(): Promise<void> {
    // Validação básica (você pode adicionar mais validações aqui)
    if (!this.name || !this.email || !this.phone || !this.message) {
      alert('Por favor, preencha todos os campos do formulário.');
      // this.toastService.showDanger('Erro', 'Por favor, preencha todos os campos do formulário.');
      return;
    }

    this.isSending = true; // Ativa o estado de envio para mostrar um spinner/mensagem

    const formData: ContactFormData = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      message: this.message
    };

    try {
      console.log('Dados do formulário de contato para envio:', formData);

      // --- SIMULAÇÃO DE ENVIO PARA BACKEND ---
      // Em um cenário real, você faria uma requisição HTTP aqui:
      // const response = await fetch('SUA_URL_DO_ENDPOINT_DE_BACKEND_DE_CONTATO', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Erro ao enviar mensagem.');
      // }

      // Simula um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Mensagem enviada com sucesso (simulado)!');
      alert('Sua mensagem foi enviada com sucesso! Em breve entraremos em contato.');
      // this.toastService.showSuccess('Sucesso!', 'Sua mensagem foi enviada com sucesso!');

      // Limpa o formulário após o envio
      this.name = '';
      this.email = '';
      this.phone = '';
      this.message = '';

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.');
      // this.toastService.showDanger('Erro', 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.');
    } finally {
      this.isSending = false; // Desativa o estado de envio
    }
  }
}