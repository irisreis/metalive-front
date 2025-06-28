import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Firestore, collection, getDocs, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../../auth.service';
import { ChatComponent } from '../../components/chat/chat.component';

// Interface para dados do cliente
interface ClienteData {
  id: string;
  nome: string;
  email: string;
  plano?: string;
  statusPlano?: string;
  diet?: string; // Conteúdo da dieta em texto
  pdfUrl?: string; // URL do PDF da dieta, se houver
  // Adicione outras propriedades relevantes do cliente aqui
}

// Interface para dados do Dashboard do Nutricionista
interface NutriDashboardData {
  planosAtivos?: number;
  aderenciaMedia?: number;
  consultasHoje?: number;
  consultasSemana?: number;
  pacientesAtivosTotal?: number;
  pacientesAtivosMes?: number;
  taxaSucessoGeral?: number;
  avaliacaoGeral?: string;
}

// Interface para Atividades Recentes
interface RecentActivity {
  icon: string;
  title: string;
  time: string;
}

@Component({
  selector: 'app-nutricionista-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ChatComponent],
  templateUrl: './nutricionista-dashboard.component.html',
  styleUrls: ['./nutricionista-dashboard.component.scss']
})
export class NutricionistaDashboardComponent implements OnInit {
  nutricionistaName: string = 'Dr(a). Amanda Santana'; // Nome do nutricionista logado
  clientList: ClienteData[] = []; // Lista de clientes
  selectedClientData: ClienteData | null = null; // Dados completos do cliente selecionado

  // Dados para o Dashboard de Visão Geral
  nutriDashboardData: NutriDashboardData | null = null;
  recentActivities: RecentActivity[] = [];

  currentContent: string = 'overview'; // Inicia no dashboard de visão geral

  // Variáveis para edição de dieta
  editingDiet: boolean = false;
  currentDietText: string = '';

  // Variáveis para upload de PDF
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  isUploading: boolean = false;

  isLoadingClients: boolean = true; // Carregamento da lista de clientes/dashboard
  isLoadingClientData: boolean = false; // Carregamento dos dados do cliente selecionado
  isSavingDiet: boolean = false; // Estado para salvar dieta

  // Texto base para nova dieta, formatado para facilitar a visualização no editor
  textoBaseDieta: string = `
**Plano de Dieta Semanal**

**Refeição 1: Café da manhã**
- Opção A: [Insira aqui]
- Opção B: [Insira aqui]
- Opção C: [Insira aqui]

**Refeição 2: Almoço**
- Opção A: [Insira aqui]
- Opção B: [Insira aqui]
- Opção C: [Insira aqui]

**Refeição 3: Lanche da tarde**
- Opção A: [Insira aqui]
- Opção B: [Insira aqui]
- Opção C: [Insira aqui]

**Refeição 4: Jantar**
- Opção A: [Insira aqui]
- Opção B: [Insira aqui]
- Opção C: [Insira aqui]

**Refeição 5: Ceia (Opcional)**
- Opção A: [Insira aqui]
- Opção B: [Insira aqui]
- Opção C: [Insira aqui]

**Observações Importantes:**
- Beba pelo menos 2-3 litros de água por dia.
- Evite alimentos industrializados, ricos em sódio e açúcares refinados.
- Mastigue bem os alimentos e coma devagar.
- Priorize alimentos frescos e integrais.

**Dicas Adicionais:**
- [Insira dicas personalizadas aqui]
`;

  private firestore: Firestore = inject(Firestore);
  private storage: Storage = inject(Storage);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    // Carregar a lista de clientes e dados do dashboard ao iniciar o componente
    this.loadNutriDashboardData();
    this.loadClientList();
  }

  /**
   * Alterna o conteúdo exibido no dashboard.
   * @param content Nome do conteúdo a ser exibido (e.g., 'overview', 'clientList', 'chat', etc.).
   */
  showContent(content: string): void {
    this.currentContent = content;
    // Se mudar para qualquer aba que não seja a de edição/upload, garante que as flags estão limpas
    if (content !== 'clientList') { // clientList pode levar a dietEditor/upload
      this.editingDiet = false;
      this.selectedFile = null;
      this.isUploading = false;
      this.uploadProgress = 0;
    }
  }

  /**
   * Carrega os dados para o dashboard de visão geral do nutricionista.
   * Estes dados seriam agregados de todos os clientes ou de uma coleção específica de métricas.
   */
  async loadNutriDashboardData(): Promise<void> {
    // Para a demo, usaremos dados mockados
    this.nutriDashboardData = {
      planosAtivos: 24,
      aderenciaMedia: 89,
      consultasHoje: 3, // Ajustado para exemplo com 3
      consultasSemana: 12, // Ajustado para exemplo com 12
      pacientesAtivosTotal: 156,
      pacientesAtivosMes: 12,
      taxaSucessoGeral: 94,
      avaliacaoGeral: 'A+',
    };

    this.recentActivities = [
      { icon: '👤', title: 'Nova consulta agendada com Maria Santos', time: 'Há 15 minutos' },
      { icon: '📋', title: 'Plano nutricional atualizado para João Silva', time: 'Há 1 hora' },
      { icon: '📊', title: 'Relatório mensal de progresso gerado', time: 'Há 2 horas' },
      { icon: '💬', title: '3 novas mensagens de pacientes', time: 'Há 3 horas' },
    ];
    // Em um ambiente real, você faria chamadas ao Firestore para buscar esses dados agregados.
    // Ex: collection(this.firestore, 'metricas_nutricionista/nutriId/geral')
  }

  /**
   * Carrega a lista de todos os clientes do Firestore.
   */
  async loadClientList(): Promise<void> {
    this.isLoadingClients = true;
    this.clientList = []; // Limpa a lista existente

    try {
      const clientsCollectionRef = collection(this.firestore, 'clientes');
      const querySnapshot = await getDocs(clientsCollectionRef);

      this.clientList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as ClienteData);

      console.log('Lista de clientes carregada:', this.clientList);

      // Se não há cliente selecionado, mas há clientes na lista, seleciona o primeiro
      if (this.clientList.length > 0 && !this.selectedClientData) {
        this.selectClient(this.clientList[0].id);
      } else if (this.clientList.length === 0) {
        this.selectedClientData = null;
      }

    } catch (error) {
      console.error('Erro ao carregar lista de clientes:', error);
      // Fallback para lista mockada em caso de erro de carregamento real
      this.clientList = this.getMockClientList();
      if (this.clientList.length > 0 && !this.selectedClientData) {
         this.selectClient(this.clientList[0].id);
      }
    } finally {
      this.isLoadingClients = false;
    }
  }

  /**
   * Seleciona um cliente e carrega seus dados detalhados.
   * @param clientId O ID do cliente a ser selecionado.
   */
  async selectClient(clientId: string): Promise<void> {
    this.isLoadingClientData = true;
    this.editingDiet = false; // Desativa o modo de edição ao mudar de cliente
    this.selectedFile = null; // Limpa o arquivo selecionado para upload
    this.uploadProgress = 0; // Reseta progresso
    this.isUploading = false; // Reseta flag de upload

    // Primeiro, busca o cliente na lista já carregada para obter informações básicas rapidamente
    const clientFromList = this.clientList.find(client => client.id === clientId);
    if (clientFromList) {
      this.selectedClientData = clientFromList;
    } else {
      this.selectedClientData = null;
      console.warn(`Cliente com ID ${clientId} não encontrado na lista local.`);
    }

    try {
      const clientDocRef = doc(this.firestore, `clientes/${clientId}`);
      const docSnapshot = await getDoc(clientDocRef);

      if (docSnapshot.exists()) {
        // Atualiza selectedClientData com os dados mais recentes e completos do Firestore
        this.selectedClientData = { id: docSnapshot.id, ...docSnapshot.data() } as ClienteData;
        this.currentDietText = this.selectedClientData.diet || this.textoBaseDieta; // Usa a dieta existente ou o texto base
        console.log('Dados do cliente selecionado e dieta carregados:', this.selectedClientData);
        // Garante que a aba de gerenciamento de clientes/edição de dieta seja a visível
        this.showContent('clientList');
      } else {
        console.warn(`Documento do cliente ${clientId} não encontrado no Firestore. Carregando dados mock. `);
        // Fallback para dados mockados se o documento não for encontrado
        this.selectedClientData = this.getMockClientData(clientId);
        this.currentDietText = this.selectedClientData.diet || this.textoBaseDieta;
        this.showContent('clientList'); // Ainda exibe a tela de gerenciamento
      }
    } catch (error) {
      console.error(`Erro ao carregar dados do cliente ${clientId}:`, error);
      // Fallback para dados mockados em caso de erro
      this.selectedClientData = this.getMockClientData(clientId);
      this.currentDietText = this.selectedClientData.diet || this.textoBaseDieta;
      this.showContent('clientList'); // Ainda exibe a tela de gerenciamento
    } finally {
      this.isLoadingClientData = false;
    }
  }

  /**
   * Ativa o modo de edição da dieta.
   */
  editDiet(): void {
    this.editingDiet = true;
  }

  /**
   * Salva as alterações da dieta no Firestore.
   */
  async saveDiet(): Promise<void> {
    if (!this.selectedClientData?.id) {
      console.error('Nenhum cliente selecionado para salvar a dieta.');
      // TODO: Adicionar feedback visual ao usuário (e.g., toast message)
      return;
    }

    this.isSavingDiet = true; // Ativa o spinner enquanto salva
    const clientDocRef = doc(this.firestore, `clientes/${this.selectedClientData.id}`);

    try {
      await updateDoc(clientDocRef, {
        diet: this.currentDietText
      });
      // Atualiza os dados localmente após salvar
      if (this.selectedClientData) {
        this.selectedClientData.diet = this.currentDietText;
      }
      this.editingDiet = false;
      console.log('Dieta atualizada e salva com sucesso!');
      // TODO: Adicionar feedback visual de sucesso ao usuário
    } catch (error) {
      console.error('Erro ao salvar a dieta:', error);
      // TODO: Adicionar feedback de erro ao usuário
    } finally {
      this.isSavingDiet = false;
    }
  }

  /**
   * Cancela o modo de edição e reverte as alterações da dieta.
   */
  cancelEdit(): void {
    this.editingDiet = false;
    // Reverte o texto da dieta para o último estado salvo
    this.currentDietText = this.selectedClientData?.diet || this.textoBaseDieta;
  }

  /**
   * Chamado quando um arquivo é selecionado para upload.
   * @param event Evento de mudança do input de arquivo.
   */
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      console.log('Arquivo selecionado:', this.selectedFile.name);
    } else {
      this.selectedFile = null;
    }
  }

  /**
   * Inicia o processo de upload do PDF para o Storage e salva a URL no Firestore.
   */
  async uploadDietPDF(): Promise<void> {
    if (!this.selectedFile || !this.selectedClientData?.id) {
      console.warn('Por favor, selecione um arquivo e um cliente antes de fazer o upload.');
      // TODO: Adicionar feedback visual ao usuário
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    const filePath = `dietas_pdf/${this.selectedClientData.id}/${this.selectedFile.name}`;
    const storageRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, this.selectedFile);

    uploadTask.on('state_changed',
      (snapshot) => {
        // Observa eventos de mudança de estado, como progresso, pausa, e resume
        this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + this.uploadProgress + '% done');
      },
      (error) => {
        // Lida com erros de upload
        console.error('Erro ao fazer upload do PDF:', error);
        this.isUploading = false;
        this.uploadProgress = 0;
        // TODO: Feedback de erro ao usuário
      },
      async () => {
        // Upload completo com sucesso
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log('PDF disponível em:', downloadURL);

        // Salva a URL do PDF no documento do cliente no Firestore
        const clientDocRef = doc(this.firestore, `clientes/${this.selectedClientData?.id}`);
        try {
          await updateDoc(clientDocRef, { pdfUrl: downloadURL });
          if (this.selectedClientData) {
            this.selectedClientData.pdfUrl = downloadURL; // Atualiza localmente
          }
          console.log('URL do PDF salva no Firestore com sucesso!');
          // TODO: Feedback de sucesso ao usuário
        } catch (error) {
          console.error('Erro ao salvar a URL do PDF no Firestore:', error);
          // TODO: Feedback de erro ao usuário
        } finally {
          this.isUploading = false;
          this.selectedFile = null; // Limpa o arquivo selecionado após o upload
          this.uploadProgress = 0;
        }
      }
    );
  }

  /**
   * Abre o PDF da dieta em uma nova aba.
   */
  viewDietPDF(): void {
    if (this.selectedClientData?.pdfUrl) {
      window.open(this.selectedClientData.pdfUrl, '_blank');
    } else {
      console.warn('Nenhuma URL de PDF disponível para este cliente.');
      // TODO: Adicionar feedback visual ao usuário
    }
  }

  /**
   * Gera as iniciais do nome para o avatar do cliente.
   * @param name O nome completo do cliente.
   * @returns As iniciais do nome.
   */
  getInitials(name: string | undefined | null): string {
    if (!name) return 'CL'; // Default para Cliente
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
  }

  /**
   * Simula uma lista de clientes mockados.
   */
  private getMockClientList(): ClienteData[] {
    return [
      { id: 'cliente_1', nome: 'Carolina de Jesus Menezes', email: 'carolina@example.com', plano: 'Metalive Premium', diet: this.textoBaseDieta, pdfUrl: 'https://www.africau.edu/images/default/sample.pdf' },
      { id: 'cliente_2', nome: 'João Silva', email: 'joao@example.com', plano: 'Metalive Básico', diet: 'Dieta do João: menos carboidratos.' },
      { id: 'cliente_3', nome: 'Maria Oliveira', email: 'maria@example.com', plano: 'Metalive VIP', diet: 'Dieta da Maria: foco em proteínas.' },
      { id: 'cliente_4', nome: 'Pedro Santos', email: 'pedro@example.com', plano: 'Metalive Premium' }
    ];
  }

  /**
   * Simula dados de um cliente mockado para quando um cliente não tem dados no Firestore.
   */
  private getMockClientData(id: string): ClienteData {
    const existingClient = this.getMockClientList().find(c => c.id === id);

    return {
      id: id,
      nome: existingClient?.nome || 'Cliente Desconhecido',
      email: existingClient?.email || 'desconhecido@example.com',
      plano: existingClient?.plano || 'Plano Mock',
      diet: this.textoBaseDieta,
      pdfUrl: 'https://www.africau.edu/images/default/sample.pdf'
    };
  }

  /**
   * Lógica de logout.
   */
  async onLogout(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
      console.log('Nutricionista deslogado e redirecionado.');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  }

  // Placeholder para o chat (se você for usar o componente <app-chat>)
  startChat(): void {
    if (this.selectedClientData) {
      console.log(`Iniciando chat com cliente: ${this.selectedClientData.nome} (ID: ${this.selectedClientData.id})`);
      // Lógica para iniciar o chat, talvez navegando para uma rota de chat
      // this.router.navigate(['/chat', this.selectedClientData.id]);
    } else {
      console.warn('Nenhum cliente selecionado para iniciar o chat.');
    }
  }

  // Métodos placeholder para as outras abas, que já foram definidos no TS
  // Eles simplesmente mudam a aba ativa para exibir o conteúdo correto
  viewConsultations(): void {
    console.log('Ver Consultas clicado');
    this.showContent('consultations');
  }

  viewReports(): void {
    console.log('Ver Relatórios clicado');
    this.showContent('reports');
  }

  viewSettings(): void {
    console.log('Ver Configurações clicado');
    this.showContent('settings');
  }
}