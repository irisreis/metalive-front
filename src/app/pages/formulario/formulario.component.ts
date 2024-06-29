import { Component } from '@angular/core';
import { Header2Component } from '../../components/header2/header2.component';
import { RodapeComponent } from '../../components/rodape/rodape.component';
import { FormComponent } from '../../components/form/form.component';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [Header2Component, RodapeComponent, FormComponent],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss'
})
export class FormularioComponent {

}
