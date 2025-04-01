import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ComboInfosComponent } from "./combo-infos.component";

describe("ComboInfosComponent", () => {
  let component: ComboInfosComponent;
  let fixture: ComponentFixture<ComboInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboInfosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComboInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
