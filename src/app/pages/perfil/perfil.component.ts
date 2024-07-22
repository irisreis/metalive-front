import { Component } from '@angular/core';
import { ProfissionalComponent } from '../../components/profissional/profissional.component';
import { DadosComponent } from '../../components/dados/dados.component';
import { RodapeComponent } from '../../components/rodape/rodape.component';
import { Header2Component } from '../../components/header2/header2.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [Header2Component, ProfissionalComponent, DadosComponent, RodapeComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {

}
