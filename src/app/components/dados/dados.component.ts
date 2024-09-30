import { Component, Input, OnInit } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-dados',
  standalone: true, 
  templateUrl: './dados.component.html',
  styleUrls: ['./dados.component.scss']
})
export class DadosComponent implements OnInit {
  @Input() clienteId: string = ''; // ID do cliente a ser carregado
  clienteData: any = null; // Para armazenar os dados do cliente

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    this.loadClienteData(); // Carrega os dados ao inicializar
  }

  async loadClienteData() {
    // Verificando se this.clienteId está definido
    if (!this.clienteId) {
      console.error("Erro: clienteId não está definido.");
      return;
    }
    
    console.log('ID do cliente:', this.clienteId);  // Log para verificar o clienteId
  
    // Corrigir o uso da interpolação de string para a referência do documento
    const clienteDocRef = doc(this.firestore, `clientes/${this.clienteId}`);
    
    try {
      const docSnapshot = await getDoc(clienteDocRef);
      
      if (docSnapshot.exists()) {
        // Se o documento existir, extraímos seus dados
        this.clienteData = docSnapshot.data();
        console.log('Dados do cliente:', this.clienteData);
      } else {
        // Se o documento não for encontrado, exibe um erro
        console.error('Documento do cliente não encontrado');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do cliente:', error);
    }
  }
  
  
  
}
