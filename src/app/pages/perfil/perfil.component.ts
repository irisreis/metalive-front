import { Component } from '@angular/core';
import { ProfissionalComponent } from '../../components/profissional/profissional.component';
import { DadosComponent } from '../../components/dados/dados.component';
import { RodapeComponent } from '../../components/rodape/rodape.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [HeaderComponent, ProfissionalComponent, DadosComponent, RodapeComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {
}
