import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestebootstrapComponent } from './testebootstrap.component';

describe('TestebootstrapComponent', () => {
  let component: TestebootstrapComponent;
  let fixture: ComponentFixture<TestebootstrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestebootstrapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestebootstrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
