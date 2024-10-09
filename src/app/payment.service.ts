import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { pagarMeConfig } from '../app/config/pagarme.config'; // Ajuste o caminho conforme necessário

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = '/api/transactions'; // Usando o proxy configurado
  private cardHashUrl = pagarMeConfig.testUrl; // Endpoint para gerar o card_hash do Pagar.me

  constructor(private http: HttpClient) { }

  // Método para processar o pagamento
  
  processPayment(paymentData: any): Observable<any> {
    const token = localStorage.getItem('token'); // Obtenha o token de onde você armazenou
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Adiciona o token ao cabeçalho
    });

    return this.http.post<any>(this.apiUrl, paymentData, { headers });
  }

  // Método para gerar o card_hash no backend
  gerarCardHash(paymentData: any): Observable<string> {
    console.log("Dentro do método gerar card hash do PaymentService");
    const token = localStorage.getItem('token'); // Obtenha o token de onde você armazenou
    console.log('Token:', token); // Verifica se o token está correto
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Adiciona o token ao cabeçalho
    });
    console.log("Header:", headers);

    return this.http.post<string>(this.cardHashUrl, paymentData, { headers }).pipe(
      catchError((error) => {
        console.error('Erro ao gerar card_hash:', error);
        return throwError(() => new Error('Erro ao gerar card_hash'));
      })
    );
  }

  // Método para gerar bytes aleatórios
  generateRandomBytes(size: number): Uint8Array {
    const array = new Uint8Array(size);
    window.crypto.getRandomValues(array);
    return array;
  }

  // Método para testar e logar bytes aleatórios
  logRandomBytes(): void {
    const randomData = this.generateRandomBytes(16);
    console.log(randomData);
  }
}
