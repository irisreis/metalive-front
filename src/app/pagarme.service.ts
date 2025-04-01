import { Injectable } from '@angular/core';
import pagarme from 'pagarme';

@Injectable({
  providedIn: 'root'
})
export class PagarmeService {
  private apiKey: string = 'SUA_CHAVE_API';

  constructor() { }

  async connect() {
    try {
      const client = await pagarme.client.connect({ api_key: this.apiKey });
      return client;
    } catch (error) {
      console.error('Erro ao conectar ao Pagar.me:', error);
      throw error;
    }
  }

  // Outros métodos para transações podem ser adicionados aqui
}
