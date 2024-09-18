import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  constructor(private firestore: Firestore) {}

  // Método para salvar os dados do formulário no Firestore
  salvarFormulario(formData: any): Promise<any> {
    const formCollection = collection(this.firestore, 'formularios');
    return addDoc(formCollection, formData);
  }

  // Método para recuperar os dados do Firestore (opcional)
  getFormularios(): Observable<any[]> {
    const formCollection = collection(this.firestore, 'formularios');
    return collectionData(formCollection, { idField: 'id' }) as Observable<any[]>;
  }
}
