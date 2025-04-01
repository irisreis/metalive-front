import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router'; // Importando RouterModule
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { AuthService } from "../../auth.service"; // Importando AuthService

@Component({
  selector: "app-profissional",
  standalone: true,
  imports: [CommonModule, RouterModule,],
  templateUrl: "./profissional.component.html",
  styleUrl: "./profissional.component.scss"
})
export class ProfissionalComponent {
  @Input() clienteId: string = ''; // ID do cliente a ser carregado
  clienteData: any = null; // Para armazenar os dados do cliente
  currentContent: string = "content1"; // Defina o conteúdo inicial, se desejar
  private authService: AuthService = inject(AuthService); 

  constructor(private firestore: Firestore) {}

  showContent(content: string) {
    this.currentContent = content;
  }
  
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
  async onLogout() {
    try {
      await this.authService.logout();
      console.log('Usuário foi deslogado e redirecionado');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  }
  
}
