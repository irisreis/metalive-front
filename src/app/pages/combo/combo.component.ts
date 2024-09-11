import { Component } from "@angular/core";
import { HeaderComponent } from "../../components/header/header.component";
import { RodapeComponent } from "../../components/rodape/rodape.component";
import { CombosComponent } from "../../components/combos/combos.component";
//import { Infos-CombosComponent } from '../../components/InfosCombos/InfosCombosComponent'
import { ComboInfosComponent } from "../../components/combo-infos/combo-infos.component";

@Component({
  selector: "app-combo",
  standalone: true,
  imports: [HeaderComponent, RodapeComponent, ComboInfosComponent],
  templateUrl: "./combo.component.html",
  styleUrl: "./combo.component.scss"
})
export class ComboComponent {

}
