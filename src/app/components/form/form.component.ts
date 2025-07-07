import { Component, OnInit, Input, OnChanges, SimpleChanges } from "@angular/core"; // Adicione OnChanges, SimpleChanges
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormService } from '../../services/form.service';

@Component({
  selector: "app-form",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"]
})
export class FormComponent implements OnInit, OnChanges { // Implemente OnChanges
  @Input() clienteId!: string; // Recebendo o clienteId como entrada
  form!: FormGroup;

  constructor(private fb: FormBuilder, private formService: FormService) {}

  ngOnInit(): void {
    console.log('FormComponent ngOnInit - clienteId inicial:', this.clienteId); // Debugging
    this.initializeForm(); // Inicializa o formulário
  }

  // ngOnChanges é chamado sempre que um @Input() muda
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clienteId'] && changes['clienteId'].currentValue) {
      console.log('FormComponent ngOnChanges - clienteId atualizado para:', changes['clienteId'].currentValue); // Debugging
      // Se o formulário já foi inicializado, atualize o campo 'uid'
      if (this.form) {
        this.form.patchValue({ uid: changes['clienteId'].currentValue });
        // Se você desabilitou o campo 'uid' no form group (como eu sugeri em uma resposta anterior para o nutricionista),
        // você precisaria habilitá-lo aqui: this.form.get('uid')?.enable();
      } else {
        // Se o formulário ainda não foi inicializado (menos comum), inicialize-o aqui
        this.initializeForm();
      }
    }
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      uid: [this.clienteId || ''], // Inicializa com o clienteId se já disponível, ou vazio
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Adicionei Validators.email
      dataNascimento: ['', Validators.required],
      genero: ['', Validators.required],
      altura: ['', [Validators.required, Validators.min(0)]], // Adicionei Validators.min para números
      peso: ['', [Validators.required, Validators.min(0)]],
      objetivo: ['', Validators.required],
      consultaDiaEHora: ['', Validators.required],
      // Campos de checkbox/radio que você pode querer consolidar
      restricaoExerciciosSim: [''],
      restricaoExerciciosNao: [''],
      pressaoArterialBaixa: [''],
      pressaoArterialMedia: [''],
      pressaoArterialAlta: [''],
      historicoDoencasHipertensao: [''],
      historicoDoencasCardiopatia: [''],
      historicoDoencasDiabetes: [''],
      expliqueHistoricoDoencas: [''],
      tratamentoDiaADiaSim: [''],
      tratamentoDiaADiaNao: [''],
      medicamentoRegularSim: [''],
      medicamentoRegularNao: [''],
      qualMedicamentoRegular: [''],
      cirurgiaRecenteSim: [''],
      cirurgiaRecenteNao: [''],
      dorDiaADiaSim: [''],
      dorDiaADiaNao: [''],
      localDorDiaADia: [""],
      atividadeFisicaSim: ['',],
      atividadeFisicaNao: ['',],
      qualAtividadeFisica: [''],
      atividadeFisicaDiasHorarios: ['', Validators.required],
      consomeBebidasAlcoolicasSim: [''],
      consomeBebidasAlcoolicasNao: [''],
      frequenciaBebidasAlcoolicas: [''],
      tabagistaSim: [''],
      tabagistaNao: [''],
      consumoAguaZero: [''],
      consumoAguaAte1l: [''],
      consumoAguaEntre1le2l: [''],
      consumoAguaEntre2le3l: [''],
      consumoAguaMais3l: [''],
      alimentosNaoGosta: ['', Validators.required],
      alimentosIndispensaveis: ['', Validators.required],
      horarioMaiorApetite: ['', Validators.required],
      refeicoesDia: ['', [Validators.required, Validators.min(1)]], // Min 1 para refeições
      alergiaIntoleranciaSim: [''],
      alergiaIntoleranciaNao: [''],
      qualAlergiaIntolerancia: ['']
    });
  }

  onSubmit() {
    // Se o campo uid foi desabilitado inicialmente e habilitado por ngOnChanges,
    // seu valor já estará lá.
    // Apenas para garantir que o UID é o valor mais recente da propriedade
    // se alguma lógica de validação for sensível a campos desabilitados.
    // this.form.get('uid')?.enable(); // Habilita o campo antes de validar se estava desabilitado

    if (this.form.valid) {
        // O valor de `this.clienteId` na propriedade do componente
        // deve ser o valor mais atualizado (do @Input).
        const formData = { ...this.form.value, uid: this.clienteId };

        // Verificação explícita do clienteId antes de salvar
        if (!this.clienteId) {
          console.error('Erro: clienteId não está definido ao tentar enviar o formulário.');
          alert('Erro: ID do cliente não encontrado. Tente recarregar a página ou contate o suporte.');
          return;
        }

        console.log('clienteId no onSubmit (da propriedade @Input):', this.clienteId); // Debugging
        console.log('Dados do formulário a serem salvos:', formData); // Debugging

        this.formService.salvarFormulario(formData).then(() => {
            console.log('Formulário salvo com sucesso!');
            alert('Formulário enviado com sucesso!');
        }).catch(error => {
            console.error('Erro ao salvar o formulário: ', error);
            alert('Erro ao salvar o formulário. Verifique o console para mais detalhes.');
        });
    } else {
        console.log('Formulário inválido');
        // Logar os erros de validação para depuração
        Object.keys(this.form.controls).forEach(key => {
            const control = this.form.get(key);
            if (control && control.invalid) {
                console.log(`Campo inválido: ${key}, Erros:`, control.errors);
            }
        });
        alert('Preencha os campos obrigatórios corretamente.');
    }
}

  onlyOne(eventTarget: EventTarget | null, groupName: string): void {
    const checkbox = eventTarget as HTMLInputElement;
    if (!checkbox) {
      console.error("Checkbox não foi encontrado.");
      return;
    }
    const checkboxes = document.getElementsByName(groupName) as NodeListOf<HTMLInputElement>;
    checkboxes.forEach((item) => {
      if (item !== checkbox) {
        item.checked = false;
      }
    });
  }
}