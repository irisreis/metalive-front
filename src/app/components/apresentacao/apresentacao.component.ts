import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ScrollService } from '../../scroll.service';

@Component({
  selector: 'app-apresentacao',
  standalone: true,
  imports: [],
  templateUrl: './apresentacao.component.html',
  styleUrls: ['./apresentacao.component.scss']
})
export class ApresentacaoComponent implements OnInit {
  @ViewChild('meuDestino') meuDestino!: ElementRef;

  constructor(private scrollService: ScrollService) {}

  ngOnInit() {
    this.scrollService.getRolagemObservable().subscribe(idElemento => {
      console.log('Recebido pedido de rolagem para:', idElemento);
      if (this.meuDestino && this.meuDestino.nativeElement) {
        console.log('Elemento encontrado:', this.meuDestino.nativeElement);
        console.log('ID do elemento de destino:', this.meuDestino.nativeElement.id);
        console.log('ID esperado:', idElemento);
        if (this.meuDestino.nativeElement.id === idElemento) {
          console.log('Rolando para o elemento:', this.meuDestino.nativeElement);
          this.meuDestino.nativeElement.scrollIntoView({ behavior: 'smooth' });
        } else {
          console.log('IDs não coincidem. Verifique se o ID está correto.');
        }
      } else {
        console.log('Elemento de destino não encontrado ou não inicializado.');
      }
    });
  }
}
