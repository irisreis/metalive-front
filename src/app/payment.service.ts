import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import pagarMe from 'pagarme';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly pagarMePublicKey = 'pk_test_R7AMzYpUYsdpZaGO';

  constructor(private http: HttpClient) {}

  createCardHash(cardData: any): Promise<any> {
    return pagarMe.client.connect({ api_key: this.pagarMePublicKey })
      .then((client: { cards: { create: (arg0: any) => any; }; }) => client.cards.create(cardData))
      .catch((error: any) => {
        console.error('Erro ao gerar card hash:', error);
        throw error;
      });
  }

  gerarCardHash(cardData: any): Observable<any> {
    return new Observable(observer => {
      this.createCardHash(cardData)
        .then(cardHash => {
          observer.next({ card_hash: cardHash });
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  processPayment(paymentData: any): Observable<any> {
    return this.http.post<any>('https://processpayment-sjlgvpsoea-uc.a.run.app', paymentData).pipe(
      catchError(error => {
        console.error('Erro ao processar pagamento:', error);
        return throwError(() => new Error('Erro ao processar pagamento'));
      })
    );
  }
}
