// src/app/services/toast.service.ts
import { Injectable } from '@angular/core';

export interface ToastInfo {
  header: string;
  body: string;
  autohide?: boolean;
  delay?: number;
  classname?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppToastService {
  toasts: ToastInfo[] = [];

  /**
   * Mostra um toast com os dados fornecidos.
   */
  show(toast: ToastInfo): void {
    const toastData: ToastInfo = {
      autohide: true,
      delay: 5000,
      classname: 'bg-success text-white', // Valor padrão, pode ser sobrescrito
      ...toast, // Sobrescreve se o dev passar outros valores
    };

    this.toasts.push(toastData);
  }

  /**
   * Mostra um toast de sucesso rápido.
   */
  showSuccess(message: string, header = 'Sucesso'): void { // <<< ESTE MÉTODO
    this.show({
      header,
      body: message,
      classname: 'bg-success text-white',
    });
  }

  /**
   * Mostra um toast de erro rápido.
   */
  showError(message: string, header = 'Erro'): void { // <<< ESTE MÉTODO
    this.show({
      header,
      body: message,
      classname: 'bg-danger text-white',
    });
  }

  /**
   * Remove um toast da lista.
   */
  remove(toast: ToastInfo): void {
    const index = this.toasts.indexOf(toast);
    if (index !== -1) {
      this.toasts.splice(index, 1);
    }
  }

  /**
   * Limpa todos os toasts.
   */
  clear(): void {
    this.toasts = [];
  }
}