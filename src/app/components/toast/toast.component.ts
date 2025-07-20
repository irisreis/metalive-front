// src/app/components/toast/toast.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para *ngFor, *ngIf etc.
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap'; // Se você usa toasts do ng-bootstrap

import { AppToastService } from '../../services/toast.service'; // Importa o serviço de toast

@Component({
  selector: 'app-toast-list', // O seletor que você usará no HTML principal
  standalone: true,
  imports: [CommonModule, NgbToastModule], // Garanta que todos os módulos necessários estejam aqui
  template: `
    <ngb-toast
      *ngFor="let toast of toastService.toasts"
      [header]="toast.header"
      [autohide]="toast.autohide ?? true"
      [delay]="toast.delay ?? 5000"
      (hidden)="toastService.remove(toast)"
      [class]="toast.classname"
    >
      <ng-template [ngIf]="toast.body">
        <strong class="mx-auto">{{ toast.body }}</strong>
      </ng-template>
    </ngb-toast>
  `,
  styles: [`
    :host {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 1200; /* Garante que o toast apareça acima de outros elementos */
    }
  `]
})
export class ToastListComponent { // <<< ESSA LINHA PRECISA TER O 'export' E O NOME CORRETO
  // Injete o AppToastService para ter acesso aos toasts
  public toastService = inject(AppToastService);
}