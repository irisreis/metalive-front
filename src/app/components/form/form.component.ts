import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../toast/toast.component';
import { AppToastService } from '../../services/toast.service';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, ToastComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  private firestore: Firestore = inject(Firestore);
  toastService = inject(AppToastService);

  formData = {
    nome: '',
    documentoIdentidade: '',
    orgaoEmissor: '',
    cpf: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    dataNascimento: '',
    sexoFeminino: false,
    sexoMasculino: false,
    restricaoExercicio: false,
    semRestricaoExercicio: false,
    pressaoBaixa: false,
    pressaoMedia: false,
    pressaoAlta: false,
    hipertensao: false,
    cardiopatia: false,
    diabetes: false,
    explicacao: '',
    tratamentoSim: false,
    tratamentoNao: false,
    medicamentoSim: false,
    medicamentoNao: false,
    quaisMedicamentos: '',
    cirurgiaSim: false,
    cirurgiaNao: false,
    dorSim: false,
    dorNao: false,
    atividadeFisica: false,
    semAtividadeFisica: false,
    qualAtividade: '',
    diasHorarios: '',
    bebidasSim: false,
    bebidasNao: false,
    frequenciaBebidas: '',
    cigarroSim: false,
    cigarroNao: false,
    aguaZero: false,
    agua1L: false,
    agua1a2L: false,
    agua2a3L: false,
    aguaMais3L: false,
    alimentoNaoGosta: '',
    alimentoGosta: '',
    horarioApetite: '',
    refeicoesNoDia: '',
    alergiaSim: false,
    alergiaNao: false,
  };

  showSuccess(title: string, message: string) {
		this.toastService.show(title, message, 'bg-success text-light');
	}

	showDanger(title: string, message: string) {
		this.toastService.show(title, message, 'bg-danger text-light');
	}

  onSubmit() {
    console.log('Dados do Formulário:', this.formData);

    const userStorage = localStorage.getItem('user')
    if (!userStorage) {
      this.showDanger('Erro', 'Usuário não encontrado na sessão. Favor fazer o login novamente.');
      return;
    }
    const uid = JSON.parse(userStorage).uid;
    
    const userDocRef = doc(this.firestore, `users/${uid}`);

    updateDoc(userDocRef, this.formData)
    .then(() => {
      this.showSuccess('Sucesso!', 'Dados salvos com sucesso.');
    })
    .catch((error) => {
      this.showDanger('Erro.', `Erro ao salvar dados: ${error}`);
      console.log(error);
    })
  }
}
