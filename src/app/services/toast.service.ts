import { Injectable } from '@angular/core';

export interface ToastInfo {
  header: string;
  body: string;
  classes: string;
  delay?: number;
}

@Injectable({ providedIn: 'root' })
export class AppToastService {
  toasts: ToastInfo[] = [];

  show(header: string, body: string, classes: string) {
    this.toasts.push({ header, body, classes });
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter(t => t != toast);
  }
}