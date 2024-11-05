import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment"; // Ajuste o caminho conforme necessário

@Injectable({
  providedIn: "root"
})
export class HttpService<T> {
  private apiURI = 'https://api.pagar.me/core/v5'; // URL base da API do Pagar.me

  constructor(private httpClient: HttpClient) { }

  private getHttpOptions() {
    const basicAuthKey = btoa(`${environment.pagarMeApiKey}:`); // Usa a chave do ambiente

    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        //"Authorization": `Basic ${basicAuthKey}` // Usa Basic Auth
      }),
    };
  }

  getTransactions(): Observable<T> {
    const url = `${this.apiURI}/transactions`;
    return this.httpClient.get<T>(url, this.getHttpOptions());
  }

  // Método para criar um pedido
  criarPedido(dadosDoPedido: any): Observable<T> {
    const url = `${this.apiURI}/orders`; // Endpoint para criar pedidos
    return this.httpClient.post<T>(url, dadosDoPedido, this.getHttpOptions());
  }
}
