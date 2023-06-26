import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { NgbCarousel, NgbSlide } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-carousel",
  templateUrl: "./carousel.component.html",
  styleUrls: ["./carousel.component.scss"],
})
export class CarouselComponent {
  @ViewChild("carousel") carousel: NgbCarousel;
  @ViewChildren(NgbSlide) _slides: QueryList<NgbSlide>;

  get slides(): NgbSlide[] {
    return this._slides.toArray();
  }

  @Input() imgUrls: string[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // Detect cahnges for slides
    this.cdr.detectChanges();
  }
}
