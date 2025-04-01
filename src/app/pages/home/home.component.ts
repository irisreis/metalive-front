import { Component, OnInit } from "@angular/core";
import { HeaderComponent } from "../../components/header/header.component";
import { CombosComponent } from "../../components/combos/combos.component";
import { InicioComponent } from "../../components/inicio/inicio.component";
import { ApresentacaoComponent } from "../../components/apresentacao/apresentacao.component";
import { BeneficiosComponent } from "../../components/beneficios/beneficios.component";
import { ContatoComponent } from "../../components/contato/contato.component";
import { RodapeComponent } from "../../components/rodape/rodape.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [ HeaderComponent, CombosComponent, InicioComponent, ApresentacaoComponent, BeneficiosComponent, ContatoComponent, RodapeComponent],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss"
})
export class HomeComponent implements OnInit {

  ngOnInit() {
    console.log('HomeComponent Initialized');
  }
}