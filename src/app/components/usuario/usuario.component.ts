import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {
  nome: string = '';
  email: string = '';
  cpf: string = '';

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {}

  async cadastrarUsuario() {
    try {
      const userDoc = await addDoc(collection(this.firestore, 'patients'), {
        nome: this.nome,
        email: this.email,
        cpf: this.cpf
      });
      console.log('Usuário cadastrado com ID:', userDoc.id);
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
    }
  }
}
