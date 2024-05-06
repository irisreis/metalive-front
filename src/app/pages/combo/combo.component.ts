import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { InfosCombosComponent } from '../../components/infos-combos/infos-combos.component';
import { RodapeComponent } from '../../components/rodape/rodape.component';

@Component({
  selector: 'app-combo',
  standalone: true,
  imports: [HeaderComponent, InfosCombosComponent, RodapeComponent],
  templateUrl: './combo.component.html',
  styleUrl: './combo.component.scss'
})
export class ComboComponent {

}
