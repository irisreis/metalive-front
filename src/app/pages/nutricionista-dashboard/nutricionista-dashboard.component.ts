import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { Firestore, getDoc, collection, getDocs, updateDoc, doc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from '../../components/chat/chat.component';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-nutricionista-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatComponent],
  templateUrl: './nutricionista-dashboard.component.html',
  styleUrls: ['./nutricionista-dashboard.component.scss']
})
export class NutricionistaDashboardComponent implements OnInit {
  // Seleção para chat
  nutricionistaId: string | null = null;
  clientes: any[] = []; // Lista de clientes
  clienteSelecionado: string | null = null; // ID do cliente selecionado

  // Seleção para dieta
  patients: any[] = [];
  selectedPatient: string = '';
  newDiet: string = '';
  currentContent: string = 'content2'; // Valor inicial

  // Upload de PDF
  selectedFile: File | null = null;
  downloadURL: string | undefined;


  textoBase: string = `
  **Plano de Dieta Semanal**

  **Café da manhã:**
  - Opção 1: [Insira aqui]
  - Opção 2: [Insira aqui]
  - Opção 3: [Insira aqui]

  **Almoço:**
  - Opção 1: [Insira aqui]
  - Opção 2: [Insira aqui]
  - Opção 3: [Insira aqui]

  **Lanche da tarde:**
  - Opção 1: [Insira aqui]
  - Opção 2: [Insira aqui]
  - Opção 3: [Insira aqui]

  **Jantar:**
  - Opção 1: [Insira aqui]
  - Opção 2: [Insira aqui]
  - Opção 3: [Insira aqui]

  **Ceia:**
  - Opção 1: [Insira aqui]
  - Opção 2: [Insira aqui]
  - Opção 3: [Insira aqui]

  **Observações:**
  - Obs 1: [Insira aqui]
  - Obs 2: [Insira aqui]
  - Obs 3: [Insira aqui]

  **Outros:**
  - [Insira observações adicionais aqui]
`; 
  dietaEditada: string = this.textoBase;

  constructor(private authService: AuthService, private firestore: Firestore, private storage: Storage) {}

  ngOnInit(): void {
    this.loadPatients();
    this.loadClientes();
  }

  async loadPatients() {
    const patientsCollection = collection(this.firestore, 'clientes');
    const patientSnapshot = await getDocs(patientsCollection);
    this.patients = patientSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(this.patients); // Verifica se os dados estão sendo carregados corretamente
  }

  async loadClientes() {
    const clientesCollection = collection(this.firestore, 'clientes');
    const clienteSnapshot = await getDocs(clientesCollection);
    this.clientes = clienteSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(this.clientes); // Verifica se os clientes estão sendo carregados corretamente
  }

  selecionarCliente(clienteId: string) {
    this.clienteSelecionado = clienteId;
    console.log(`Cliente selecionado: ${clienteId}`);
  }

  iniciarChat() {
    console.log('Iniciando chat com cliente:', this.clienteSelecionado);
    // Aqui você pode adicionar mais lógica se necessário
  }

  async onLogout() {
    try {
      await this.authService.logout();
      console.log('Usuário foi deslogado e redirecionado');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  }

  async updateDiet() {
    if (!this.selectedPatient || !this.newDiet) {
      alert('Por favor, selecione um paciente e insira uma nova dieta.');
      return;
    }

    const patientDocRef = doc(this.firestore, 'clientes', this.selectedPatient);
    const docSnapshot = await getDoc(patientDocRef);
    
    if (docSnapshot.exists()) {
      await updateDoc(patientDocRef, { diet: this.newDiet });
      alert('Dieta atualizada com sucesso!');
    } else {
      console.error('Documento não encontrado');
      alert('Erro: Documento não encontrado para atualização.');
    }
  }

  // Função de upload de PDF
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }
  onSubmit() {
    if (this.selectedFile && this.clienteSelecionado) { // Verifica se um cliente foi selecionado
      const filePath = `uploads/${this.clienteSelecionado}/${this.selectedFile.name}`; // Salva o arquivo no diretório do cliente
      const fileRef = ref(this.storage, filePath);
      const task = uploadBytesResumable(fileRef, this.selectedFile);
  
      task.on('state_changed', 
        snapshot => {
          // Progresso do upload pode ser exibido aqui
        }, 
        error => {
          console.error('Erro ao fazer upload:', error);
        }, 
        async () => {
          // Quando o upload for concluído, obtenha a URL do arquivo
          const downloadURL = await getDownloadURL(task.snapshot.ref);
          this.downloadURL = downloadURL;
          console.log('File available at', this.downloadURL);
          
          // Aqui você pode salvar a URL do PDF no Firestore na coleção do cliente
          if (this.clienteSelecionado) { // Verifica se clienteSelecionado não é null
            const clienteDocRef = doc(this.firestore, 'clientes', this.clienteSelecionado);
            try {
              await updateDoc(clienteDocRef, { pdfUrl: this.downloadURL });
              alert('PDF carregado e URL salva no Firestore com sucesso!');
            } catch (error) {
              console.error('Erro ao salvar a URL no Firestore:', error);
              alert('Erro ao salvar a URL no Firestore.');
            }
          }
        }
      );
    } else {
      alert('Por favor, selecione um cliente e um arquivo antes de fazer o upload.');
    }
  }
  
  
  showContent(content: string) {
    this.currentContent = content;
  }
}
