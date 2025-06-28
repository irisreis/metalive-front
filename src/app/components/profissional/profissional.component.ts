import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { AuthService } from "../../auth.service";

interface ClienteData {
  nome?: string;
  plano?: string;
  statusPlano?: string;
  proximasConsultas?: any[];
  aderenciaDieta?: number;
  pesoPerdidoMes?: number;
  diet?: string;
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
  // NOVA PROPRIEDADE PARA O FORMULÁRIO
  formularioPreenchido?: boolean;
  ultimaAtualizacaoFormulario?: string; // Ex: '25/06/2025' ou 'N/A'
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

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    this.loadClienteData();
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

    console.log('ID do cliente:', this.clienteId);

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
      nome: 'Carolina de Jesus Menezes',
      plano: 'PLANO PREMIUM',
      statusPlano: 'ATIVO',
      proximasConsultas: [{ id: '1', tipo: 'nutri', data: '2025-07-15' }],
      aderenciaDieta: 85,
      pesoPerdidoMes: -2.5,
      diet: `
        **Plano Alimentar Personalizado**

        **Observações Importantes:**
        * Evite alimentos industrializados com alto teor de sódio.
        * Beba pelo menos 2 litros de água por dia.

        **Opções de Refeições:**

        **Café da manhã:**
        * Opção 1: 2 fatias de pão integral, 1 ovo cozido, 1 copo de suco natural de laranja.
        * Opção 2: Aveia com frutas (banana, maçã, morangos), 1 iogurte natural.

        **Almoço:**
        * Opção 1: 1 filé de frango grelhado, arroz integral, feijão preto, salada de folhas verdes.
        * Opção 2: Peixe assado, batata doce, brócolis, salada variada.

        **Jantar:**
        * Opção 1: Sopa de legumes com frango desfiado.
        * Opção 2: Salada completa com grão de bico e atum.
      `,
      treinosRealizados: 12,
      frequenciaTreino: '4x Semana',
      treino: `
        **Meu Plano de Treino**

        **Foco: Ganho de Massa Muscular e Resistência**

        **Segunda-feira: Membros Inferiores e Cardio**
        * Agachamento: 3x10
        * Leg Press: 3x12
        * Cadeira Extensora: 3x15
        * Esteira: 20 minutos (moderado)

        **Terça-feira: Membros Superiores (Peito/Tríceps)**
        * Supino Reto: 3x10
        * Crucifixo: 3x12
        * Tríceps Pulley: 3x15
        * Flexões: 3xMAX

        **Quarta-feira: Descanso Ativo**
        * Caminhada leve ou Yoga.

        **Quinta-feira: Membros Inferiores e Core**
        * Levantamento Terra: 3x8
        * Afundo: 3x10 (cada perna)
        * Abdominais: 3x20
        * Prancha: 3x45s

        **Sexta-feira: Membros Superiores (Costas/Bíceps) e Cardio**
        * Remada Curvada: 3x10
        * Puxada Alta: 3x12
        * Rosca Direta: 3x15
        * Bicicleta Ergométrica: 20 minutos (moderado)

        **Sábado: Treino de Corpo Inteiro (Circuito)**
        * Circuito de 3 a 4 exercícios, 3 rounds.
        * Ex: Burpees, Mountain Climbers, Polichinelos, Skipping.

        **Domingo: Descanso Total**
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
      // DADOS MOCKADOS PARA O NOVO FORMULÁRIO CARD
      formularioPreenchido: false, // Defina como true ou false para testar os estados
      ultimaAtualizacaoFormulario: '10/06/2025',
    };
  }

  getInitials(name: string | undefined | null): string {
    if (!name) return 'CM';
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

  downloadDietPDF(): void {
    console.log('Botão "Baixar PDF" (Dieta) clicado');
  }

  viewNutritionHistory(): void {
    console.log('Botão "Histórico Nutricional" clicado');
  }

  updateProgress(): void {
    console.log('Botão "Atualizar Progresso" (Nutrição) clicado');
  }

  downloadWorkoutPDF(): void {
    console.log('Botão "Baixar PDF" (Treino) clicado');
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
      console.log('Usuário foi deslogado e redirecionado');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  }
}