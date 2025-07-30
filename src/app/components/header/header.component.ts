import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para ngIf
import { RouterModule } from '@angular/router'; // Para routerLink

@Component({
  selector: 'app-header', // Selector para usar no template pai
  standalone: true,
  imports: [CommonModule, RouterModule], // Importar CommonModule e RouterModule
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMobileMenuOpen: boolean = false; // Estado para controlar a visibilidade do menu mobile

  constructor() { }

  ngOnInit(): void {
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  scrollToSection(sectionId: string): void {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

  // Opcional: Fechar menu ao clicar em um link
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}