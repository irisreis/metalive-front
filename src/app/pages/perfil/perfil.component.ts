import { Component } from '@angular/core';
import { ProfissionalComponent } from '../../components/profissional/profissional.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ProfissionalComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {

}
