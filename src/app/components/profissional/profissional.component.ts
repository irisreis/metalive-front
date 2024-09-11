import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";


@Component({
  selector: "app-profissional",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./profissional.component.html",
  styleUrl: "./profissional.component.scss"
})
export class ProfissionalComponent {
  currentContent: string = "content1"; // Defina o conteúdo inicial, se desejar

  showContent(content: string) {
    this.currentContent = content;
  }
}
