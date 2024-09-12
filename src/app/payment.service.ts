// src/app/payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = '/api/transactions'; // Agora usa o proxy configurado
  //private apiUrl = 'https://api.pagar.me/1/transactions'; // URL da API do Pagar.me
  private pagarmeApiKey = 'sk_test_...'; // Substitua com a sua chave secreta

  constructor(private http: HttpClient) { }

  // Método para processar o pagamento
  processPayment(paymentData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Basic ${btoa(this.pagarmeApiKey + ':')}`,
      'Content-Type': 'application/json'
    });
    
    return this.http.post<any>(this.apiUrl, paymentData, { headers });
  }

  // Método para criar uma transação
  createTransaction(paymentData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Basic ${btoa(this.pagarmeApiKey + ':')}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, paymentData, { headers });
  }
}
