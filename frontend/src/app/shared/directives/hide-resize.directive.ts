import { Directive, ElementRef, Input, AfterViewInit, OnDestroy } from "@angular/core";
import { fromEvent, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Directive({
  selector: "[hideOn]",
})
export class HideResizeDirective implements AfterViewInit, OnDestroy {
  /** Hide the element with the following number as a threshold in pixels */
  @Input() hideOn: number;

  /** The operator used for comparison, default is "<=" */
  @Input() hideOperator: "<" | "<=" | ">" | ">=" = "<=";

  /** The target element */
  el: HTMLElement;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngAfterViewInit(): void {
    this.toogleElementVisibility();
    fromEvent(window, "resize")
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.toogleElementVisibility());
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /** Hides the element if teh comparison is true */
  private toogleElementVisibility(): void {
    if (this.hideElement()) this.el.classList.add("d-none");
    else this.el.classList.remove("d-none");
  }

  /**
   * Compare the hideOn size with the window size
   * @returns True if the element will be hidden
   */
  private hideElement(): boolean {
    return new Function("a", "b", `return a ${this.hideOperator} b`)(
      window.innerWidth,
      this.hideOn,
    );
  }
}
