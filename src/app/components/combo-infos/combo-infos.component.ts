import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ElementRef, QueryList, Renderer2, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common"; // Necessário para diretivas como ngIf, ngFor (embora não usadas diretamente aqui, é bom ter para HTML)
import { RouterModule } from "@angular/router"; // Se seus botões CTA usarem routerLink

@Component({
  selector: "app-combo-infos",
  standalone: true,
  imports: [CommonModule, RouterModule], // Adicionado CommonModule e RouterModule
  templateUrl: "./combo-infos.component.html",
  styleUrls: ["./combo-infos.component.scss"] // Note o 's' em styleUrls
})
export class ComboInfosComponent implements OnInit, AfterViewInit {

  // Referência para o indicador de scroll (assumindo que ele existe no HTML)
  @ViewChild('scrollIndicator') scrollIndicator!: ElementRef;

  // Referência para o botão CTA (assumindo que ele existe no HTML)
  @ViewChild('ctaButton') ctaButton!: ElementRef;

  // Referências para os elementos a serem animados
  @ViewChildren('animatedElement') animatedElements!: QueryList<ElementRef>;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    // Código de inicialização que não depende do DOM estar pronto.
    // Neste caso, não há nada específico aqui para o JS original.
  }

  ngAfterViewInit(): void {
    // Código de inicialização que depende do DOM estar pronto.
    // Setup do Intersection Observer para animações de entrada.
    this.setupIntersectionObserver();
    // Setup do efeito de clique no botão CTA.
    this.setupCtaButtonEffect();
  }

  // --- Indicador de Scroll ---
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    if (this.scrollIndicator) {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      this.renderer.setStyle(this.scrollIndicator.nativeElement, 'transform', `scaleX(${scrolled / 100})`);
    }
  }

  // --- Animações de Entrada (Intersection Observer) ---
  private setupIntersectionObserver(): void {
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1, // Elemento visível em 10%
      rootMargin: '0px 0px -20px 0px' // Margem para acionar antes de entrar completamente
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Quando o elemento entra na viewport
          this.renderer.setStyle(entry.target, 'opacity', '1');
          this.renderer.setStyle(entry.target, 'transform', 'translateY(0)');
          // Opcional: Parar de observar depois de animar para otimização
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observa todos os elementos animados que foram encontrados no HTML
    this.animatedElements.forEach((el, index) => {
      // Define estilos iniciais para a animação
      this.renderer.setStyle(el.nativeElement, 'opacity', '0');
      this.renderer.setStyle(el.nativeElement, 'transform', 'translateY(30px)');
      this.renderer.setStyle(el.nativeElement, 'transition', 'opacity 0.6s ease, transform 0.6s ease');
      // Adiciona um delay escalonado
      this.renderer.setStyle(el.nativeElement, 'transition-delay', `${index * 0.1}s`);
      observer.observe(el.nativeElement);
    });
  }

  // --- Efeito no Botão CTA ---
  private setupCtaButtonEffect(): void {
    if (this.ctaButton) {
      this.renderer.listen(this.ctaButton.nativeElement, 'click', () => {
        // Aplica a transformação de escala
        this.renderer.setStyle(this.ctaButton.nativeElement, 'transform', 'scale(0.95)');

        setTimeout(() => {
          // Reverte a transformação após um curto período
          this.renderer.setStyle(this.ctaButton.nativeElement, 'transform', 'scale(1)');

          // Simular redirecionamento
          console.log('🚀 Redirecionando para o checkout seguro...');
          // TODO: Substitua este console.log por uma navegação Angular ou um modal/toast:
          // Ex: this.router.navigate(['/checkout-seguro']);
          // Ex: this.toastService.showSuccess('Redirecionando...', 'Você será levado ao checkout seguro.');
        }, 150);
      });
    }
  }
}