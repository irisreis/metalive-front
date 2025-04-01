import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public collectionAux: string;

  constructor() {
    this.collectionAux = ''; // Inicializa como uma string vazia ou outro valor padrão
  }
}
