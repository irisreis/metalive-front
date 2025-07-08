import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from '@angular/router';
// Importe 'collection', 'query', 'where', 'getDocs' para consultas
import { Firestore, doc, getDoc, collection, query, where, getDocs } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { AuthService } from "../../auth.service";
import { User } from '@angular/fire/auth';

//import { Nl2brPipe } from '../../pipes/nl2br.pipe';

interface ClienteData {
  id?: string;
  nome?: string;
  plano?: string;
  statusPlano?: string;
  proximasConsultas?: any[];
  aderenciaDieta?: number;
  pesoPerdidoMes?: number;
  diet?: string;
  pdfUrl?: string;
  treinoPdfUrl?: string;
  treinosRealizados?: number;
  frequenciaTreino?: string;
  treino?: string;
  progressoGeral?: number;
  avaliacaoGeral?: string;
  diasAtivos?: number;
  diasAtivosChange?: string;
  pesoAtual?: number;
  pesoDesdeInicio?: string;
  caloriasDia?: number;
  metaCalorias?: number;
  taxaSucesso?: number;
  taxaSucessoChange?: string;
  metaCaloriasNutricional?: number;
  caloriasConsumidas?: number;
  aderenciaNutricional?: number;
  treinosSemanaConcluidos?: number;
  sessoesRestantes?: number;
  treinoAderencia?: number;
  formularioPreenchido?: boolean;
  ultimaAtualizacaoFormulario?: string;
}

@Component({
  selector: "app-profissional",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./profissional.component.html",
  styleUrl: "./profissional.component.scss"
})
export class ProfissionalComponent implements OnInit {
  @Input() clienteId: string = '';
  clienteData: ClienteData | null = null;
  currentContent: string = "overview";
  isLoading: boolean = true;
  formularioPreenchidoStatus: boolean = false;

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private firestore: Firestore = inject(Firestore);

  constructor() {}

  ngOnInit(): void {
    this.authService.getCurrentUserObservable().subscribe(async (user: User | null) => {
      if (user && !this.clienteId) {
        this.clienteId = user.uid;
        await this.loadClienteData();
        await this.checkIfFormExists(this.clienteId);
      } else if (this.clienteId) {
        await this.loadClienteData();
        await this.checkIfFormExists(this.clienteId);
      } else {
        console.warn("Nenhum clienteId fornecido e nenhum usuário logado. Carregando dados de exemplo.");
        this.clienteData = this.getMockClienteData();
        this.isLoading = false;
        await this.checkIfFormExists(this.clienteData.id || '');
      }
    });
  }

  showContent(content: string): void {
    this.currentContent = content;
  }

  async loadClienteData(): Promise<void> {
    this.isLoading = true;

    if (!this.clienteId) {
      console.error("Erro: clienteId não está definido. Carregando dados de exemplo.");
      this.clienteData = this.getMockClienteData();
      this.isLoading = false;
      return;
    }

    console.log('ID do cliente para loadClienteData:', this.clienteId);

    const clienteDocRef = doc(this.firestore, `clientes/${this.clienteId}`);

    try {
      const docSnapshot = await getDoc(clienteDocRef);

      if (docSnapshot.exists()) {
        this.clienteData = docSnapshot.data() as ClienteData;
        console.log('Dados do cliente:', this.clienteData);
        this.populateMockDataIfMissing();
      } else {
        console.warn(`Documento do cliente com ID '${this.clienteId}' não encontrado. Carregando dados de exemplo.`);
        this.clienteData = this.getMockClienteData();
      }
    } catch (error) {
      console.error('Erro ao carregar dados do cliente:', error);
      this.clienteData = this.getMockClienteData();
    } finally {
      this.isLoading = false;
    }
  }

  private populateMockDataIfMissing(): void {
    if (!this.clienteData) return;

    this.clienteData = {
      ...this.getMockClienteData(),
      ...this.clienteData
    };
  }

  private getMockClienteData(): ClienteData {
    return {
      id: 'mock_cliente_id_para_verificacao',
      nome: 'Cliente Exemplo',
      plano: 'PLANO METALIVE',
      statusPlano: 'ATIVO',
      proximasConsultas: [{ id: '1', tipo: 'nutri', data: '2025-07-15' }],
      aderenciaDieta: 85,
      pesoPerdidoMes: -2.5,
      diet: `
        **Plano Alimentar Personalizado**
        ... (texto da dieta) ...
      `,
      pdfUrl: 'https://www.africau.edu/images/default/sample.pdf',
      treinoPdfUrl: 'https://www.africau.edu/images/default/sample.pdf',
      treinosRealizados: 12,
      frequenciaTreino: '4x Semana',
      treino: `
        **Meu Plano de Treino**
        ... (texto do treino) ...
      `,
      progressoGeral: 92,
      avaliacaoGeral: 'A+',
      diasAtivos: 28,
      diasAtivosChange: '+12%',
      pesoAtual: 67.2,
      pesoDesdeInicio: '-3.8kg',
      caloriasDia: 2850,
      metaCalorias: 2800,
      taxaSucesso: 89,
      taxaSucessoChange: '+5%',
      metaCaloriasNutricional: 2800,
      caloriasConsumidas: 2650,
      aderenciaNutricional: 85,
      treinosSemanaConcluidos: 4,
      sessoesRestantes: 1,
      treinoAderencia: 80,
      formularioPreenchido: false,
      ultimaAtualizacaoFormulario: '10/06/2025',
    };
  }

  /**
   * Verifica se existe um formulário preenchido para o cliente no Firestore.
   * Busca um documento na coleção 'formularios' onde o campo 'uid' seja igual ao clienteId.
   * Atualiza ambas as variáveis de status.
   * @param clienteId O UID do cliente.
   */
  async checkIfFormExists(clienteId: string): Promise<void> {
    if (!clienteId) {
      console.warn('clienteId é inválido para verificar formulário.');
      this.formularioPreenchidoStatus = false;
      if (this.clienteData) {
        this.clienteData.formularioPreenchido = false;
      }
      return;
    }
    try {
      // Cria uma query para buscar um documento na coleção 'formularios'
      // onde o campo 'uid' é igual ao clienteId
      const q = query(collection(this.firestore, 'formularios'), where('uid', '==', clienteId));
      const querySnapshot = await getDocs(q); // Executa a query

      const exists = !querySnapshot.empty; // Se o snapshot não estiver vazio, significa que o formulário existe
     
      this.formularioPreenchidoStatus = exists;
      if (this.clienteData) {
        this.clienteData.formularioPreenchido = exists;
      }
      console.log(`Formulário para cliente ${clienteId} existe: ${this.formularioPreenchidoStatus}`);
    } catch (error) {
      console.error('Erro ao verificar formulário no Firestore:', error);
      this.formularioPreenchidoStatus = false;
      if (this.clienteData) {
        this.clienteData.formularioPreenchido = false;
      }
    }
  }

  getInitials(name: string | undefined | null): string {
    if (!name) return 'CE';
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
  }

  scheduleConsultation(): void {
    console.log('Agendar Nova Consulta clicado');
  }

  viewHistory(type: string): void {
    console.log(`Ver Histórico de ${type} clicado`);
  }

  openNutritionPlan(): void {
    console.log('Acessar Plano Nutricional clicado');
    this.showContent('nutritionist');
  }

  viewReports(type: string): void {
    console.log(`Ver Relatório de ${type} clicado`);
  }

  openWorkout(): void {
    console.log('Treino de Hoje clicado');
    this.showContent('personalTrainer');
  }

  viewAnalytics(): void {
    console.log('Relatório Completo clicado');
    this.showContent('reports');
  }

  exportData(): void {
    console.log('Exportar Dados clicado');
  }

  /**
   * Abre o PDF da dieta em uma nova aba do navegador.
   * Exibe um alerta se a URL do PDF não estiver disponível.
   */
  downloadDietPDF(): void {
    if (this.clienteData && this.clienteData.pdfUrl) {
      window.open(this.clienteData.pdfUrl, '_blank');
      console.log('Abrindo PDF da dieta:', this.clienteData.pdfUrl);
    } else {
      console.warn('Nenhuma dieta em PDF disponível para este cliente.');
      alert('Nenhuma dieta em PDF disponível para download no momento.');
    }
  }

  viewNutritionHistory(): void {
    console.log('Botão "Histórico Nutricional" clicado');
  }

  updateProgress(): void {
    console.log('Botão "Atualizar Progresso" (Nutrição) clicado');
  }

  /**
   * Abre o PDF do treino em uma nova aba do navegador.
   * Exibe um alerta se a URL do PDF não estiver disponível.
   */
  downloadWorkoutPDF(): void {
    if (this.clienteData && this.clienteData.treinoPdfUrl) {
      window.open(this.clienteData.treinoPdfUrl, '_blank');
      console.log('Abrindo PDF do treino:', this.clienteData.treinoPdfUrl);
    } else {
      console.warn('Nenhum treino em PDF disponível para este cliente.');
      alert('Nenhum treino em PDF disponível para download no momento.');
    }
  }

  viewPersonalHistory(): void {
    console.log('Botão "Histórico de Treinos" clicado');
  }

  updateWorkoutProgress(): void {
    console.log('Botão "Atualizar Progresso" (Treino) clicado');
  }

  async onLogout(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
      console.log('Usuário foi deslogado e redirecionado');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  }
}