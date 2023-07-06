import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from "@angular/core";
import { Subject, fromEvent } from "rxjs";
import { ProductCardData } from "shared";
import { CardComponent } from "../card/card.component";
import { isMobile } from "src/app/utils";
import { delay } from "shared";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-card-list",
  templateUrl: "./card-list.component.html",
  styleUrls: ["./card-list.component.scss"],
})
export class CardListComponent implements AfterViewInit, OnDestroy {
  /** The gap between the cards */
  static readonly cardsFlexGap = 5;

  @ViewChild("list") _list: ElementRef<HTMLDivElement>;
  /** Div list with horizontal scroll */
  get list() {
    return this._list.nativeElement;
  }

  /** Array with cards data */
  @Input()
  cards: ProductCardData[] = [];

  /** Indicates if the component will show the loading cards */
  @Input()
  showLoadingCards: boolean = true;

  /** Emits the number of cards that needs to be loaded */
  @Output() loadCards = new EventEmitter<number>();

  /** Array to repeat loading cards divs */
  loadingCards: number[] = [];
  /** The scroll amount in px for desktop */
  scrollAmount: number;
  /** Indicates if the list is scrolling */
  isScrolling: boolean = false;
  /** Amount of cards being displayed */
  amountOfDisplayCards: number;
  /** The card width */
  cardWidth: number;
  /** Indicate if the arrow will be shown */
  showArrows: boolean = true;

  destroy$: Subject<any> = new Subject<any>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setListDimensions();

    fromEvent(this.list, "scrollend")
      .pipe(takeUntil(this.destroy$))
      .subscribe(async () => {
        this.isScrolling = false;

        // Emit load cards event if the if they are showing and visible
        if (this.showLoadingCards && this.isLoadingCardsVisible()) {
          this.loadCards.emit(this.amountOfDisplayCards);
        }

        if (this.isScrollOnMobile()) {
          await delay(100); // delay to wait if a new scroll is initiated by the user
          this.mobileScroll();
        }
      });

    fromEvent(this.list, "scroll")
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isScrolling = true;
      });

    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Set the dimentions of the list for mobile and desktop */
  setListDimensions() {
    this.cardWidth =
      (isMobile() ? CardComponent.cardWidthMobile : CardComponent.cardWidth) +
      CardListComponent.cardsFlexGap;
    this.amountOfDisplayCards = Math.floor(this.list.clientWidth / this.cardWidth);
    this.scrollAmount = this.amountOfDisplayCards * this.cardWidth;
    this.showArrows = this.cards.length > this.amountOfDisplayCards;
    if (this.showArrows) {
      this.loadingCards = Array.from({ length: this.amountOfDisplayCards + 1 });
    } else {
      this.showLoadingCards = false;
      this.loadingCards = [];
    }
  }

  /** Go to the next cards in the list */
  next(): void {
    if (this.isLoadingCardsVisible() || this.isScrolling) return;
    this.isScrolling = true;
    this.scrollList(this.scrollAmount);
  }

  /** Go to the previos cards in the list */
  prev(): void {
    if (this.isScrolling || this.list.scrollLeft === 0) return;
    this.isScrolling = true;
    this.scrollList(-this.scrollAmount);
  }

  /**
   * Indicates if the list is showing the loading cards
   * @returns A boolean that represents if the loading cards are being shown
   */
  isLoadingCardsVisible(): boolean {
    if (!this.showLoadingCards) return false;
    return this.cards.length * this.cardWidth < this.list.scrollLeft + this.list.clientWidth;
  }

  /** Scroll on mobile to align the list with the start of a card */
  mobileScroll(): void {
    if (this.isScrolling) return;

    let amountRelativeScroll = this.list.scrollLeft % this.cardWidth;
    // Get the direction to scroll by for the card
    if (amountRelativeScroll < this.cardWidth / 2) {
      amountRelativeScroll = -amountRelativeScroll;
    } else {
      amountRelativeScroll = this.cardWidth - amountRelativeScroll;
    }

    this.isScrolling = true;
    this.scrollList(amountRelativeScroll);
  }

  /**
   * Indicates if a scroll on mobile is need to align the cards
   * @returns A boolean that indicates if the scrolls needs to happend
   */
  isScrollOnMobile(): boolean {
    if (!isMobile() && this.isScrolling) return false;

    // Get the amount of scroll past the start of the card
    // and if its more than 0 then scroll is needed
    const amountRelativeScroll = this.list.scrollLeft % this.cardWidth;
    return amountRelativeScroll > 0;
  }

  /**
   * Scroll the list with smooth behavior
   * @param amount The amount in px to scroll
   */
  scrollList(amount: number): void {
    this.list.scrollBy({ left: amount, behavior: "smooth" });
  }
}
