import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CarouselComponent } from "./carousel.component";
import { SharedModule } from "../../shared.module";
import { NgbCarouselModule } from "@ng-bootstrap/ng-bootstrap";
import { getNewCompoenntInstance } from "src/tests/utils/common";
import { ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";

describe("CarouselComponent", () => {
  let component: CarouselComponent;
  let fixture: ComponentFixture<CarouselComponent>;

  beforeEach(async () => {
    // Reset mocks between tests
    jest.resetAllMocks();

    await TestBed.configureTestingModule({
      declarations: [CarouselComponent],
      imports: [SharedModule, NgbCarouselModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    const detectChangesMock = jest.spyOn(component["cdr"], "detectChanges");

    component.ngAfterViewInit();

    expect(component).toBeTruthy();
    expect(detectChangesMock).toBeCalled();
  });

  describe("test carousel interactions", () => {
    it("should test left arrow click", () => {
      const prevMock = jest.spyOn(component.carousel, "prev").mockReturnValue();
      const leftArrow = fixture.nativeElement.querySelector('[direction="left"]');
      leftArrow.click();

      expect(prevMock).toBeCalled();
    });

    it("should test right arrow click", () => {
      const nextMock = jest.spyOn(component.carousel, "next").mockReturnValue();
      const rightArrow = fixture.nativeElement.querySelector('[direction="right"]');
      rightArrow.click();

      expect(nextMock).toBeCalled();
    });

    it("should test the clicks on the paginations dots", async () => {
      component.imgUrls = Array.from({ length: 7 }, (_, i) => i.toString());
      component.carousel.pause();
      component.carousel.animation = false;
      const cdr = fixture.debugElement.injector.get(ChangeDetectorRef);
      cdr.detectChanges();
      fixture.detectChanges();

      const selectMock = jest.spyOn(component.carousel, "select");
      const dots: HTMLElement[] = fixture.nativeElement.querySelectorAll(".dot");

      expect(dots[0].classList.contains("active")).toBeTruthy();

      dots[3].click();
      fixture.detectChanges();
      expect(dots[3].classList.contains("active")).toBeTruthy();

      dots[6].click();
      fixture.detectChanges();
      expect(dots[6].classList.contains("active")).toBeTruthy();

      expect(selectMock).toHaveBeenNthCalledWith(1, "ngb-slide-3");
      expect(selectMock).toHaveBeenNthCalledWith(2, "ngb-slide-6");
    });
  });
});
