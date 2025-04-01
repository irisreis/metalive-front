import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InfosCombosComponent } from "./infos-combos.component";

describe("InfosCombosComponent", () => {
  let component: InfosCombosComponent;
  let fixture: ComponentFixture<InfosCombosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfosCombosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfosCombosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
