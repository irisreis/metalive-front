import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private rolar$ = new Subject<string>();

  emitirRolagem(id: string) {
    this.rolar$.next(id);
  }

  getRolagemObservable() {
    return this.rolar$.asObservable();
  }
}
