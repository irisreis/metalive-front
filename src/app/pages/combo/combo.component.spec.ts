import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ComboComponent } from "./combo.component";

describe("CombosComponent", () => {
  let component: ComboComponent;
  let fixture: ComponentFixture<ComboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
