import { ScrollService } from "../../scroll.service";
import { Component } from "@angular/core";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss"
})
export class HeaderComponent {
  constructor(private scrollService: ScrollService) {}

  rolarParaDestino(event: Event, idElemento: string) {
    event.preventDefault();
    console.log("Evento de rolagem emitido para:", idElemento);//tirar
    this.scrollService.emitirRolagem(idElemento);
  }
}
