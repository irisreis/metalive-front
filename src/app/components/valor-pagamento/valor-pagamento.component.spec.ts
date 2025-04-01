import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValorPagamentoComponent } from './valor-pagamento.component';

describe('ValorPagamentoComponent', () => {
  let component: ValorPagamentoComponent;
  let fixture: ComponentFixture<ValorPagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValorPagamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValorPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
