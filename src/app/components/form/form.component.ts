import { Component } from '@angular/core';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  onlyOne(eventTarget: EventTarget | null, groupName: string): void {
    const checkbox = eventTarget as HTMLInputElement;
    if (!checkbox) {
      console.error('Checkbox não foi encontrado.');
      return;
    }
    const checkboxes = document.getElementsByName(groupName) as NodeListOf<HTMLInputElement>;
    checkboxes.forEach((item) => {
        if (item !== checkbox) {
            item.checked = false;
        }
    });
  }
}
