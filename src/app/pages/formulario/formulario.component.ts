import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { RodapeComponent } from '../../components/rodape/rodape.component';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [HeaderComponent, RodapeComponent],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss'
})
export class FormularioComponent {

}
