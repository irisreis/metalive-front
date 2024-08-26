import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ScrollService } from '../../scroll.service';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [],
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.scss'
})
export class ContatoComponent implements AfterViewInit {
  @ViewChild('destinoContato') destinoContato!: ElementRef;

  constructor(private scrollService: ScrollService) {}

  ngAfterViewInit() {
    this.scrollService.getRolagemObservable().subscribe(idElemento => {
      console.log('Recebido pedido de rolagem para:', idElemento);
      if (this.destinoContato && this.destinoContato.nativeElement) {
        console.log('Elemento encontrado:', this.destinoContato.nativeElement);
        console.log('ID do elemento de destino:', this.destinoContato.nativeElement.id);
        console.log('ID esperado:', idElemento);
        if (this.destinoContato.nativeElement.id === idElemento) {
          console.log('Rolando para o elemento:', this.destinoContato.nativeElement);
          this.destinoContato.nativeElement.scrollIntoView({ behavior: 'smooth' });
        } else {
          console.log('IDs não coincidem. Verifique se o ID está correto.');
        }
      } else {
        console.log('Elemento de destino não encontrado ou não inicializado.');
      }
    });
  }
}
