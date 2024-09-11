import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class PaymentService {

  //private apiUrl = "http://localhost:5001/YOUR_PROJECT_ID/us-central1/processPayment"; // Atualize com o URL da sua função Firebase
  private apiUrl = 'https://api.pagar.me/1/transactions'; // Ajuste a URL conforme necessário

  constructor(private http: HttpClient) { }

  processPayment(paymentData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, paymentData);
  }
  createTransaction(paymentData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/process-payment`, paymentData);
  }
}
