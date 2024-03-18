import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CombosComponent } from '../../components/combos/combos.component';
import { InicioComponent } from '../../components/inicio/inicio.component';
import { ApresentacaoComponent } from '../../components/apresentacao/apresentacao.component';
import { BeneficiosComponent } from '../../components/beneficios/beneficios.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ HeaderComponent, CombosComponent, InicioComponent, ApresentacaoComponent, BeneficiosComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
