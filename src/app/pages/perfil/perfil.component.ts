import { Component, OnInit } from "@angular/core";
import { ProfissionalComponent } from "../../components/profissional/profissional.component";
import { DadosComponent } from "../../components/dados/dados.component";
import { RodapeComponent } from "../../components/rodape/rodape.component";
import { Header2Component } from "../../components/header2/header2.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-perfil",
  standalone: true,
  imports: [Header2Component, ProfissionalComponent, DadosComponent, RodapeComponent],
  templateUrl: "./perfil.component.html",
  styleUrl: "./perfil.component.scss"
})
export class PerfilComponent implements OnInit{
  clienteId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: { [x: string]: string; }) => {
      this.clienteId = params['id']; // Obtém o ID do cliente da rota
      // Aqui você pode chamar um método para carregar os dados do cliente, se necessário.
    });
}}
