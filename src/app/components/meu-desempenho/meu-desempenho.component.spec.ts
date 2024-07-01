import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeuDesempenhoComponent } from './meu-desempenho.component';

describe('MeuDesempenhoComponent', () => {
  let component: MeuDesempenhoComponent;
  let fixture: ComponentFixture<MeuDesempenhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeuDesempenhoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeuDesempenhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
