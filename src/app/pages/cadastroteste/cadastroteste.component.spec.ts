import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrotesteComponent } from './cadastroteste.component';

describe('CadastrotesteComponent', () => {
  let component: CadastrotesteComponent;
  let fixture: ComponentFixture<CadastrotesteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrotesteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastrotesteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
