import { Component } from "@angular/core";
import { HeaderComponent } from "../../components/header/header.component";
import { RodapeComponent } from "../../components/rodape/rodape.component";
import { FormComponent } from "../../components/form/form.component";

@Component({
  selector: "app-formulario",
  standalone: true,
  imports: [HeaderComponent, RodapeComponent, FormComponent],
  templateUrl: "./formulario.component.html",
  styleUrl: "./formulario.component.scss"
})
export class FormularioComponent {

}
