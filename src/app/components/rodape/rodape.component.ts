import { Component } from "@angular/core";
import { ScrollService } from "../../scroll.service";

@Component({
  selector: "app-rodape",
  standalone: true,
  imports: [],
  templateUrl: "./rodape.component.html",
  styleUrl: "./rodape.component.scss"
})
export class RodapeComponent {
  constructor(private scrollService: ScrollService) {}

  rolarParaDestino(event: Event, idElemento: string) {
    event.preventDefault();
    console.log("Evento de rolagem emitido para:", idElemento);//tirar
    this.scrollService.emitirRolagem(idElemento);
  }
}
