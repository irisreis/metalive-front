import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { FormComponent } from "../../components/form/form.component";

@Component({
    selector: "app-formulario",
    templateUrl: "./formulario.component.html",
    imports:[ FormComponent],
    standalone: true,
    styleUrls: ["./formulario.component.scss"]
})
export class FormularioComponent implements OnInit {
    clienteId!: string;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        // Obtenha o clienteId da rota
        // this.clienteId = this.route.snapshot.paramMap.get('clienteId') || '';
        // console.log('clienteId obtido em FormularioComponent:', this.clienteId);
        this.clienteId = this.route.snapshot.paramMap.get('uid') || ''; // <<<<< MUDOU DE 'clienteId' PARA 'uid'
        console.log('clienteId obtido em FormularioComponent:', this.clienteId); // Log para confirmar
    }
}
