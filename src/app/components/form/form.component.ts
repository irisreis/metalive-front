import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Importando ReactiveFormsModule
import { CommonModule } from '@angular/common'; // Importando CommonModule para suporte a tags padrão

@Component({
  selector: "app-form",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // Adicionando ReactiveFormsModule e CommonModule aos imports
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"]
})
export class FormComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      documentoIdentidade: ['', Validators.required],
      orgaoEmissor: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      cep: ['', Validators.required],
      rua: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      dataNascimento: ['', Validators.required],
      sexo: [''],
      restricaoExercicios: [''],
      pressaoArterial: [''],
      historicoDoencas: [''],
      expliqueHistoricoDoencas: [''],
      tratamentoDiaADia: [''],
      medicamentoRegular: [''],
      qualMedicamentoRegular: [''],
      cirurgiaInternamento: [''],
      dorDiaADia: [''],
      localDorDiaADia: [""],
      atividadeFisica: [''],
      qualAtividadeFisica: [''],
      atividadeFisicaDiasHorarios: [''],
      consomeBebidasAlcoolicas: [''],
      frequenciaBebidasAlcoolicas: [''],
      tabagista: [''],
      consumoAgua: [''],
      alimentosNaoGosta: [''],
      alimentosIndispensaveis: [''],
      horarioMaiorApetite: [''],
      refeicoesDia: [''],
      alergiaIntolerancia: [''],
      qualAlergiaIntolerancia: ['']
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    } else {
      console.log('Formulário inválido');
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
