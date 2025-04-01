import { Component } from "@angular/core";
import { Header2Component } from "../../components/header2/header2.component";
import { RodapeComponent } from "../../components/rodape/rodape.component";
import { CombosComponent } from "../../components/combos/combos.component";
import { ComboInfosComponent } from "../../components/combo-infos/combo-infos.component";

@Component({
  selector: "app-combo",
  standalone: true,
  imports: [Header2Component, RodapeComponent, ComboInfosComponent],
  templateUrl: "./combo.component.html",
  styleUrl: "./combo.component.scss"
})
export class ComboComponent {

}
