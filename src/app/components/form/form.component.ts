import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Importando ReactiveFormsModule
import { CommonModule } from '@angular/common'; // Importando CommonModule para suporte a tags padrão
import { FormService } from '../../services/form.service';

@Component({
  selector: "app-form",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // Adicionando ReactiveFormsModule e CommonModule aos imports
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"]
})
export class FormComponent implements OnInit {
  @Input() clienteId!: string; // Recebendo o clienteId como entrada
  form!: FormGroup;

  constructor(private fb: FormBuilder, private formService: FormService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      uid: [this.clienteId],
      nome: ['', Validators.required],
      email: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      genero: ['', Validators.required],
      altura: ['', Validators.required],
      peso: ['', Validators.required],
      objetivo: ['', Validators.required],
      consultaDiaEHora: ['', Validators.required],
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
      refeicoesDia: ['', Validators.required],
      alergiaIntoleranciaSim: [''],
      alergiaIntoleranciaNao: [''],
      qualAlergiaIntolerancia: ['']
    });
  }
  onSubmit() {
    if (this.form.valid) {
        // Combine os dados do formulário com o clienteId
        const formData = { ...this.form.value, clienteId: this.clienteId };

        // Verifique se clienteId está definido
        console.log('clienteId:', this.clienteId); // Adicione esta linha para depuração

        this.formService.salvarFormulario(formData).then(() => {
            console.log('Formulário salvo com sucesso!');
            alert('Formulário enviado com sucesso!');
        }).catch(error => {
            console.error('Erro ao salvar o formulário: ', error);
        });
    } else {
        console.log('Formulário inválido');
        alert('Preencha os campos obrigatórios');
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
