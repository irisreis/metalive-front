import { Component } from '@angular/core';
import { Cadastro2Component } from '../../components/cadastro2/cadastro2.component';
import { RodapeComponent } from '../../components/rodape/rodape.component';

@Component({
  selector: 'app-cadastroteste',
  standalone: true,
  imports: [Cadastro2Component, RodapeComponent],
  templateUrl: './cadastroteste.component.html',
  styleUrl: './cadastroteste.component.scss'
})
export class CadastrotesteComponent {

}
