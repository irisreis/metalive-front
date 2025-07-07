import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Firestore, collection, getDocs, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators'; // Mantenha finalize se usar em outros lugares, mas para uploadTask.on() não é estritamente necessário

import { AuthService } from '../../auth.service';
import { ChatComponent } from '../../components/chat/chat.component'; // Importado para caso você queira usar o chat

// Interface para dados do cliente (reutilizada)
interface ClienteData {
  id: string;
  nome: string;
  email: string;
  plano?: string;
  statusPlano?: string;
  treino?: string; // Conteúdo do treino em texto
  treinoPdfUrl?: string; // URL do PDF do treino, se houver
  // Adicione outras propriedades relevantes do cliente aqui (ex: peso, histórico de treinos, etc.)
}

// Interface para dados do Dashboard do Personal Trainer
interface PersonalDashboardData {
  planosAtivos?: number;
  aderenciaMedia?: number;
  sessoesHoje?: number;
  sessoesSemana?: number;
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
  selector: 'app-personal-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ChatComponent],
  templateUrl: './personal-dashboard.component.html',
  styleUrls: ['./personal-dashboard.component.scss']
})
export class PersonalDashboardComponent implements OnInit {
  personalTrainerName: string = 'Prof. Maicon Salles'; // Nome do personal logado
  clientList: ClienteData[] = []; // Lista de clientes
  selectedClientData: ClienteData | null = null; // Dados completos do cliente selecionado

  // Dados para o Dashboard de Visão Geral do Personal
  personalDashboardData: PersonalDashboardData | null = null;
  recentActivities: RecentActivity[] = [];

  currentContent: string = 'overview'; // Inicia no dashboard de visão geral

  // Variáveis para edição de treino
  editingTreino: boolean = false;
  currentTreinoText: string = '';

  // Variáveis para upload de PDF
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  isUploading: boolean = false;

  isLoadingClients: boolean = true; // Carregamento da lista de clientes/dashboard
  isLoadingClientData: boolean = false; // Carregamento dos dados do cliente selecionado
  isSavingTreino: boolean = false; // Estado para salvar treino

  // Texto base para novo treino, formatado para facilitar a visualização no editor
  textoBaseTreino: string = `
**Plano de Treino Semanal Personalizado**

**Foco:** [Insira o foco do treino, ex: Hipertrofia, Resistência, Emagrecimento]

**Segunda-feira: Membros Inferiores (Força)**
- Agachamento Livre: 4 séries x 8-12 repetições
- Leg Press: 3 séries x 10-15 repetições
- Cadeira Extensora: 3 séries x 12-18 repetições
- Cadeira Flexora: 3 séries x 12-18 repetições
- Panturrilha em pé: 4 séries x 15-20 repetições

**Terça-feira: Membros Superiores (Peito e Tríceps)**
- Supino Reto com Barra: 4 séries x 8-12 repetições
- Supino Inclinado com Halteres: 3 séries x 10-15 repetições
- Crucifixo na máquina: 3 séries x 12-18 repetições
- Tríceps Pulley: 3 séries x 12-18 repetições
- Tríceps Testa: 3 séries x 10-15 repetições

**Quarta-feira: Cardio e Core**
- Corrida/Esteira: 30-40 minutos (intensidade moderada)
- Prancha: 3 séries x 45-60 segundos
- Abdominal Remador: 3 séries x 15-20 repetições
- Elevação de pernas: 3 séries x 15-20 repetições

**Quinta-feira: Membros Inferiores (Ênfase em Glúteos/Posterior)**
- Levantamento Terra (Sumô ou Convencional): 4 séries x 6-10 repetições
- Elevação Pélvica: 3 séries x 10-15 repetições
- Stiff com Halteres: 3 séries x 10-15 repetições
- Glúteo Máquina: 3 séries x 15-20 repetições

**Sexta-feira: Membros Superiores (Costas e Bíceps)**
- Puxada Alta (Lat Pulldown): 4 séries x 8-12 repetições
- Remada Baixa (Seated Row): 3 séries x 10-15 repetições
- Remada Curvada com Halteres: 3 séries x 10-15 repetições
- Rosca Direta com Barra: 3 séries x 10-15 repetições
- Rosca Alternada com Halteres: 3 séries x 10-15 repetições

**Sábado/Domingo: Descanso Ativo / Alongamento / Lazer**
- Caminhada leve, Yoga, natação, ou total descanso.

**Observações Importantes:**
- Realize um aquecimento de 5-10 minutos antes de cada treino (cardio leve e alongamento dinâmico).
- Faça um desaquecimento de 5-10 minutos após o treino (alongamento estático).
- Mantenha a hidratação adequada durante o dia.
- Procure um sono de qualidade (7-9 horas por noite) para recuperação muscular.
- Aumente a carga progressivamente, mantendo a boa forma.
- Em caso de dor, interrompa o exercício e procure orientação.

**Dicas Adicionais:**
- [Insira dicas personalizadas aqui]
`;

  private firestore: Firestore = inject(Firestore);
  private storage: Storage = inject(Storage); // Injetando Storage
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    // Carregar a lista de clientes e dados do dashboard ao iniciar o componente
    this.loadPersonalDashboardData();
    this.loadClientList();
  }

  /**
   * Alterna o conteúdo exibido no dashboard.
   * @param content Nome do conteúdo a ser exibido (e.g., 'overview', 'clientList', 'chat', etc.).
   */
  showContent(content: string): void {
    this.currentContent = content;
    // Se mudar para qualquer aba que não seja a de gerenciamento de clientes, limpa as flags de edição/upload
    if (content !== 'clientList') { // 'clientList' pode levar a 'treinoEditor'/'upload'
      this.editingTreino = false;
      this.selectedFile = null;
      this.isUploading = false;
      this.uploadProgress = 0;
    }
  }

  /**
   * Carrega os dados para o dashboard de visão geral do Personal Trainer.
   * Estes dados seriam agregados de todos os clientes ou de uma coleção específica de métricas.
   */
  async loadPersonalDashboardData(): Promise<void> {
    // Para a demo, usaremos dados mockados
    this.personalDashboardData = {
      planosAtivos: 85, // Número de planos de treino ativos
      aderenciaMedia: 78, // Aderência média dos clientes aos treinos
      sessoesHoje: 5, // Sessões de treino agendadas para hoje
      sessoesSemana: 25, // Total de sessões de treino agendadas para a semana
      pacientesAtivosTotal: 120, // Total de pacientes ativos
      pacientesAtivosMes: 8, // Novos pacientes este mês
      taxaSucessoGeral: 88, // Taxa de sucesso geral dos treinos
      avaliacaoGeral: 'B+', // Avaliação geral
    };

    this.recentActivities = [
      { icon: '💪', title: 'Novo treino adicionado para Pedro Mendes', time: 'Há 20 minutos' },
      { icon: '📅', title: 'Sessão de treino agendada com Ana Clara', time: 'Há 1 hora' },
      { icon: '📈', title: 'Progresso semanal de Lucas Barbosa atualizado', time: 'Há 3 horas' },
      { icon: '💬', title: 'Nova mensagem de feedback de Marina Lima', time: 'Há 4 horas' },
    ];
    // Em um ambiente real, você faria chamadas ao Firestore para buscar esses dados agregados.
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

      // Se houver clientes e nenhum estiver selecionado, seleciona o primeiro por padrão
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
    this.editingTreino = false; // Desativa o modo de edição ao mudar de cliente
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
        this.currentTreinoText = this.selectedClientData.treino || this.textoBaseTreino; // Usa o treino existente ou o texto base
        console.log('Dados do cliente selecionado e treino carregados:', this.selectedClientData);
        // Garante que a aba de gerenciamento de clientes/edição de treino seja a visível
        this.showContent('clientList'); // Permanece na aba de gerenciamento de clientes
      } else {
        console.warn(`Documento do cliente ${clientId} não encontrado no Firestore. Carregando dados mock.`);
        // Fallback para dados mockados se o documento não for encontrado
        this.selectedClientData = this.getMockClientData(clientId);
        this.currentTreinoText = this.selectedClientData.treino || this.textoBaseTreino;
        this.showContent('clientList'); // Permanece na aba de gerenciamento de clientes
      }
    } catch (error) {
      console.error(`Erro ao carregar dados do cliente ${clientId}:`, error);
      // Fallback para dados mockados em caso de erro
      this.selectedClientData = this.getMockClientData(clientId);
      this.currentTreinoText = this.selectedClientData.treino || this.textoBaseTreino;
      this.showContent('clientList'); // Permanece na aba de gerenciamento de clientes
    } finally {
      this.isLoadingClientData = false;
    }
  }

  /**
   * Ativa o modo de edição do treino.
   */
  editTreino(): void {
    this.editingTreino = true;
  }

  /**
   * Salva as alterações do treino no Firestore.
   */
  async saveTreino(): Promise<void> {
    if (!this.selectedClientData?.id) {
      console.error('Nenhum cliente selecionado para salvar o treino.');
      // TODO: Adicionar feedback visual ao usuário
      return;
    }

    this.isSavingTreino = true; // Ativa o spinner enquanto salva
    const clientDocRef = doc(this.firestore, `clientes/${this.selectedClientData.id}`);

    try {
      await updateDoc(clientDocRef, {
        treino: this.currentTreinoText
      });
      // Atualiza os dados localmente após salvar
      if (this.selectedClientData) {
        this.selectedClientData.treino = this.currentTreinoText;
      }
      this.editingTreino = false;
      console.log('Treino atualizado e salvo com sucesso!');
      // TODO: Adicionar feedback visual de sucesso ao usuário
    } catch (error) {
      console.error('Erro ao salvar o treino:', error);
      // TODO: Adicionar feedback de erro ao usuário
    } finally {
      this.isSavingTreino = false;
    }
  }

  /**
   * Cancela o modo de edição e reverte as alterações do treino.
   */
  cancelEditTreino(): void {
    this.editingTreino = false;
    // Reverte o texto do treino para o último estado salvo
    this.currentTreinoText = this.selectedClientData?.treino || this.textoBaseTreino;
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
  async uploadTreinoPDF(): Promise<void> {
    if (!this.selectedFile || !this.selectedClientData?.id) {
      console.warn('Por favor, selecione um arquivo e um cliente antes de fazer o upload.');
      // TODO: Adicionar feedback visual ao usuário
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    // --- Início das modificações para a lógica de upload ---
    console.log('Iniciando upload para o Storage...');
    console.log('Cliente ID:', this.selectedClientData.id);
    console.log('Nome do arquivo:', this.selectedFile.name);

    // Adicionar um timestamp ao nome do arquivo para garantir unicidade e evitar cache
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${this.selectedFile.name}`;
    const filePath = `treinos_pdf/${this.selectedClientData.id}/${fileName}`; // Use o novo fileName
    
    console.log('Caminho completo no Storage:', filePath);

    const storageRef = ref(this.storage, filePath);
    console.log('Referência do Storage criada:', storageRef);

    // Adicionar um pequeno atraso para ver se algo está bloqueando o início imediato (para debug)
    await new Promise(resolve => setTimeout(resolve, 50)); 

    const uploadTask = uploadBytesResumable(storageRef, this.selectedFile);

    console.log('Tarefa de upload iniciada. Objeto uploadTask:', uploadTask);

    uploadTask.on('state_changed',
      (snapshot) => {
        // Observa eventos de mudança de estado, como progresso, pausa, e resume
        this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + this.uploadProgress + '% done. Bytes transferidos:', snapshot.bytesTransferred, 'Total bytes:', snapshot.totalBytes);
        
        // Feedback visual no console para ver se esta parte está sendo ativada
        if (this.uploadProgress > 0 && this.uploadProgress < 100) {
          console.log(`Progresso: ${this.uploadProgress.toFixed(0)}%`);
        }
      },
      (error) => {
        // Lida com erros de upload
        console.error('Erro REAL ao fazer upload do PDF:', error); // Mensagem mais destacada
        this.isUploading = false;
        this.uploadProgress = 0;
        alert('Erro ao fazer upload do PDF. Verifique o console para detalhes.'); // Feedback visual
      },
      async () => {
        // Upload completo com sucesso
        console.log('Upload CONCLUÍDO. Tentando obter URL de download...');
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('PDF disponível em:', downloadURL);

          // Salva a URL do PDF no documento do cliente no Firestore
          const clientDocRef = doc(this.firestore, `clientes/${this.selectedClientData?.id}`);
          try {
            await updateDoc(clientDocRef, { treinoPdfUrl: downloadURL }); // Salva como 'treinoPdfUrl'
            if (this.selectedClientData) {
              this.selectedClientData.treinoPdfUrl = downloadURL; // Atualiza localmente
            }
            console.log('URL do PDF do treino salva no Firestore com sucesso!');
            alert('Upload e atualização do Firestore concluídos com sucesso!'); // Feedback final
          } catch (error) {
            console.error('Erro ao salvar a URL do PDF do treino no Firestore:', error);
            alert('Erro ao salvar a URL do PDF do treino no Firestore. Tente novamente.');
          } finally {
            this.isUploading = false;
            this.selectedFile = null; // Limpa o arquivo selecionado após o upload
            this.uploadProgress = 0;
          }
        } catch (downloadUrlError) {
          console.error('Erro ao obter URL de download:', downloadUrlError);
          alert('Erro ao finalizar o upload (não foi possível obter a URL).');
          this.isUploading = false;
          this.uploadProgress = 0;
        }
      }
    );
    // --- Fim das modificações para a lógica de upload ---
  }

  /**
   * Abre o PDF do treino em uma nova aba.
   */
  viewTreinoPDF(): void {
    if (this.selectedClientData?.treinoPdfUrl) { // Usa 'treinoPdfUrl'
      window.open(this.selectedClientData.treinoPdfUrl, '_blank');
    } else {
      console.warn('Nenhuma URL de PDF de treino disponível para este cliente.');
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
      { id: 'cliente_1', nome: 'Lucas Mendes', email: 'lucas@example.com', plano: 'Metalive Premium', treino: this.textoBaseTreino, treinoPdfUrl: 'https://www.africau.edu/images/default/sample.pdf' },
      { id: 'cliente_2', nome: 'Mariana Costa', email: 'mariana@example.com', plano: 'Metalive Básico', treino: 'Treino da Mariana: foco em cardio.' },
      { id: 'cliente_3', nome: 'Rafael Dias', email: 'rafael@example.com', plano: 'Metalive VIP', treino: 'Treino do Rafael: alta intensidade.' },
      { id: 'cliente_4', nome: 'Fernanda Lima', email: 'fernanda@example.com', plano: 'Metalive Premium' }
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
      treino: this.textoBaseTreino,
      treinoPdfUrl: 'https://www.africau.edu/images/default/sample.pdf'
    };
  }

  /**
   * Lógica de logout.
   */
  async onLogout(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
      console.log('Personal Trainer deslogado e redirecionado.');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  }

  // Métodos placeholder para as outras abas
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
}