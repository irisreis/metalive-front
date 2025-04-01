import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { HttpClient } from '@angular/common/http'; // Importando o HttpClient para enviar requisições HTTP
import { ScrollService } from "../../scroll.service";

@Component({
  selector: "app-contato",
  standalone: true,
  imports: [],
  templateUrl: "./contato.component.html",
  styleUrls: ["./contato.component.scss"]
})
export class ContatoComponent implements AfterViewInit {
  @ViewChild("destinoContato") destinoContato!: ElementRef;

  nome: string = '';
  email: string = '';
  mensagem: string = '';

  constructor(private scrollService: ScrollService, private http: HttpClient) {}

  ngAfterViewInit() {
    this.scrollService.getRolagemObservable().subscribe(idElemento => {
      if (this.destinoContato && this.destinoContato.nativeElement) {
        if (this.destinoContato.nativeElement.id === idElemento) {
          this.destinoContato.nativeElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  }

  // Função para enviar o e-mail
  sendEmail() {
    const emailData = {
      nome: this.nome,
      email: this.email,
      mensagem: this.mensagem
    };

    // Envia o e-mail para a função Firebase 
    this.http.post('https://us-central1-metalive-8b9e7.cloudfunctions.net/sendEmail', emailData)
    .subscribe({
      next: (response: any) => {
        console.log('E-mail enviado com sucesso', response);
        // Aqui você pode mostrar uma mensagem de sucesso ao usuário
      },
      error: (error: any) => {
        console.error('Erro ao enviar o e-mail', error);
        // Aqui você pode mostrar uma mensagem de erro ao usuário
      },
      complete: () => {
        console.log('Processo de envio de e-mail concluído');
      }
    });
  
  }
}
