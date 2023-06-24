import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ArrowNavigatorComponent } from "./arrow-navigator.component";
import { MatIconModule } from "@angular/material/icon";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("ArrowNavigatorComponent", () => {
  let component: ArrowNavigatorComponent;
  let fixture: ComponentFixture<ArrowNavigatorComponent>;

  beforeEach(async () => {
    // Reset mocks between tests
    jest.resetAllMocks();

    try {
      const a = await TestBed.configureTestingModule({
        declarations: [ArrowNavigatorComponent],
        imports: [MatIconModule],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    } catch (error) {
      console.log(error);
      console.trace(error);
    }

    fixture = TestBed.createComponent(ArrowNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should test the component right arrow", () => {
    component.direction = "right";
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector("mat-icon").innerHTML).toBe(
      "chevron_right",
    );
  });

  it("should test the component left arrow", () => {
    component.direction = "left";
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector("mat-icon").innerHTML).toBe(
      "chevron_left",
    );
  });
});
