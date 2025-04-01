import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, orderBy, getDocs, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private firestore: Firestore) {}

  // Método para enviar uma mensagem
  async sendMessage(senderId: string, receiverId: string, message: string): Promise<void> {
    const messagesCollection = collection(this.firestore, 'messages');
    await addDoc(messagesCollection, {
      senderId,
      receiverId,
      message,
      timestamp: new Date()
    });
  }
  async getClients(): Promise<any[]> {
    const clientsCollection = collection(this.firestore, 'clientes');
    const clientSnapshot = await getDocs(clientsCollection);
    return clientSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  // Método para obter mensagens entre dois usuários
  getMessages(senderId: string, receiverId: string): Observable<any[]> {
    const messagesCollection = collection(this.firestore, 'messages');
    const q = query(messagesCollection, orderBy('timestamp'));
    return collectionData(q) as Observable<any[]>;
  }
}
