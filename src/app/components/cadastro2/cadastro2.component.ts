import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-cadastro2',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cadastro2.component.html',
  styleUrl: './cadastro2.component.scss'
})
export class Cadastro2Component {
  email: string = ''; // Defina a propriedade 'email' aqui
  password: string = ''; // Defina a propriedade 'email' aqui

}
