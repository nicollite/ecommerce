const fromEventMock = jest.fn();

jest.mock("src/app/utils");
jest.mock("shared");
jest.mock("rxjs", () => {
  return {
    ...jest.requireActual("rxjs"),
    fromEvent: fromEventMock,
  };
});

import { ComponentFixture, TestBed, fakeAsync, flush } from "@angular/core/testing";

import { CardListComponent } from "./card-list.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { SharedModule } from "../../shared.module";
import { ProductCardData, delay } from "shared";
import { desktopWindowWidth } from "src/tests/utils/common";
import { isMobile } from "src/app/utils";
import { CardComponent } from "../card/card.component";
import { mocked } from "jest-mock";
import { FakeObservable, createFakeObservable, createFakeSubject } from "@jest-utils";

function createMockCard(): ProductCardData {
  return {
    name: "Product name",
    productId: "id",
    mainImgSrc: "http://fakeimg.pl/220x220/444444",
    freeShipping: true,
    pricing: {
      original_price: 1500,
      price: 1000,
      installments: {
        amount: 10,
        total_value: 1000,
      },
    },
  };
}

let mockCards = Array.from({ length: 10 }, () => createMockCard());

let windowInnerWidth = desktopWindowWidth;
Object.defineProperty(window, "innerWidth", { get: () => windowInnerWidth });

let fromEventObsMock: FakeObservable;

const delayMock = mocked(delay);
const isMobileMock = mocked(isMobile);

function setupMocks() {
  fromEventObsMock = createFakeObservable();
  fromEventMock.mockReturnValue(fromEventObsMock);
}

describe("CardListComponent", () => {
  let component: CardListComponent;
  let fixture: ComponentFixture<CardListComponent>;

  beforeEach(async () => {
    // Reset mocks between tests
    jest.resetAllMocks();
    setupMocks();

    await TestBed.configureTestingModule({
      declarations: [CardListComponent],
      imports: [SharedModule, MatProgressSpinnerModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CardListComponent);
    component = fixture.componentInstance;

    component.cards = mockCards;

    fixture.detectChanges();
  });

  it("should create the component", () => {
    jest.resetAllMocks();
    setupMocks();

    const setListDimensionsSpy = jest.spyOn(component, "setListDimensions").mockReturnValue();
    const detectChangesMock = jest.spyOn(component["cdr"], "detectChanges").mockReturnValue();

    component.ngAfterViewInit();

    expect(component).toBeTruthy();

    expect(setListDimensionsSpy).toBeCalled();

    expect(fromEventMock).toBeCalledTimes(2);
    expect(fromEventObsMock.pipe).toBeCalledTimes(2);
    expect(fromEventObsMock.subscribe).toBeCalledTimes(2);

    expect(detectChangesMock).toBeCalled();
  });

  describe("Test the list scrollend event", () => {
    let isLoadingCardsVisibleSpy: jest.SpyInstance<boolean>;
    let loadCardsEmitSpy: jest.SpyInstance<void>;
    let isScrollOnMobileSpy: jest.SpyInstance<boolean>;
    let mobileScrollSpy: jest.SpyInstance<void>;

    beforeEach(() => {
      isLoadingCardsVisibleSpy = jest.spyOn(component, "isLoadingCardsVisible");
      loadCardsEmitSpy = jest.spyOn(component.loadCards, "emit");
      isScrollOnMobileSpy = jest.spyOn(component, "isScrollOnMobile");
      mobileScrollSpy = jest.spyOn(component, "mobileScroll");
    });

    it.each([
      {
        name: "should test scrollend on desktop where loading cards are visible",
        setup: {
          isLoadingCardsVisibleSpy: false,
          isScrollOnMobileSpy: false,
        },
        expects: {
          loadCardsEmitSpy: 0,
          delayMock: 0,
          mobileScrollSpy: 0,
        },
      },
      {
        name: "should test scrollend on desktop where loading cards are visible",
        setup: {
          isLoadingCardsVisibleSpy: true,
          isScrollOnMobileSpy: false,
        },
        expects: {
          loadCardsEmitSpy: 1,
          delayMock: 0,
          mobileScrollSpy: 0,
        },
      },
      {
        name: "should test scrollend on mobile where loading cards are not visible",
        setup: {
          isLoadingCardsVisibleSpy: false,
          isScrollOnMobileSpy: true,
        },
        expects: {
          loadCardsEmitSpy: 0,
          delayMock: 1,
          mobileScrollSpy: 1,
        },
      },
      {
        name: "should test scrollend on mobile where loading cards are visible",
        setup: {
          isLoadingCardsVisibleSpy: true,
          isScrollOnMobileSpy: true,
        },
        expects: {
          loadCardsEmitSpy: 1,
          delayMock: 1,
          mobileScrollSpy: 1,
        },
      },
    ])("$name", async ({ setup, expects }) => {
      isLoadingCardsVisibleSpy.mockReturnValue(setup.isLoadingCardsVisibleSpy);
      isScrollOnMobileSpy.mockReturnValue(setup.isScrollOnMobileSpy);
      delayMock.mockReturnValue(undefined);
      mobileScrollSpy.mockReturnValue(undefined);
      component.isScrolling = true;

      const scrollendSubNext = fromEventObsMock.subscribe.getNext();
      await scrollendSubNext();

      expect(component.isScrolling).toBeFalsy();

      expect(isLoadingCardsVisibleSpy).toBeCalled();
      expect(loadCardsEmitSpy).toBeCalledTimes(expects.loadCardsEmitSpy);

      expect(isScrollOnMobileSpy).toBeCalled();
      expect(delayMock).toBeCalledTimes(expects.delayMock);
      expect(mobileScrollSpy).toBeCalledTimes(expects.mobileScrollSpy);
    });
  });

  it("should test scroll event", () => {
    component.isScrolling = false;
    const scrollSubNext = fromEventObsMock.subscribe.getNext(1);
    scrollSubNext();

    expect(component.isScrolling).toBeTruthy();
  });

  it("should test component destroy", () => {
    const destroyFakeSub = createFakeSubject();
    component.destroy$ = destroyFakeSub as any;

    fixture.destroy();

    expect(destroyFakeSub.next).toBeCalledTimes(1);
    expect(destroyFakeSub.complete).toBeCalledTimes(1);
  });

  describe("Test component methods", () => {
    describe("test setListDimensions()", () => {
      it("should set cards for desktop", () => {
        isMobileMock.mockReturnValue(false);

        component.setListDimensions();

        expect(component.cardWidth).toBe(CardComponent.cardWidth + CardListComponent.cardsFlexGap);
      });

      it("should set cards for mobile", () => {
        isMobileMock.mockReturnValue(true);

        component.setListDimensions();

        expect(component.cardWidth).toBe(
          CardComponent.cardWidthMobile + CardListComponent.cardsFlexGap,
        );
      });

      it("should hide arrows", () => {
        component.cards = [];
        jest.spyOn(component.list, "clientWidth", "get").mockReturnValue(900);

        component.setListDimensions();

        expect(component.showArrows).toBeFalsy();
        expect(component.showLoadingCards).toBeFalsy();
        expect(component.loadingCards.length).toBe(0);
      });
    });

    describe("test next()", () => {
      it.each([
        {
          setup: {
            isLoadingCardsVisibleSpy: true,
            isScrolling: true,
          },
          expects: {
            scrollList: 0,
            isScrolling: true,
          },
        },
        {
          setup: {
            isLoadingCardsVisibleSpy: false,
            isScrolling: true,
          },
          expects: {
            scrollList: 0,
            isScrolling: true,
          },
        },
        {
          setup: {
            isLoadingCardsVisibleSpy: true,
            isScrolling: false,
          },
          expects: {
            scrollList: 0,
            isScrolling: false,
          },
        },
        {
          setup: {
            isLoadingCardsVisibleSpy: false,
            isScrolling: false,
          },
          expects: {
            scrollList: 1,
            isScrolling: true,
          },
        },
      ])(
        `should test with:
            isLoadingCardsVisible(): $setup.isLoadingCardsVisibleSpy
            isScrolling: $setup.isScrolling`,
        ({ setup, expects }) => {
          const isLoadingCardsVisibleSpy = jest
            .spyOn(component, "isLoadingCardsVisible")
            .mockReturnValue(setup.isLoadingCardsVisibleSpy);
          component.isScrolling = setup.isScrolling;
          const scrollListSpy = jest.spyOn(component, "scrollList").mockReturnValue();
          const scrollAmount = 700;
          component.scrollAmount = scrollAmount;

          component.next();

          expect(isLoadingCardsVisibleSpy).toBeCalled();
          expect(component.isScrolling).toBe(expects.isScrolling);
          if (expects.scrollList > 0) {
            expect(scrollListSpy).toBeCalledWith(scrollAmount);
          }
        },
      );
    });

    describe("test prev()", () => {
      it.each([
        {
          setup: {
            scrollLeft: 0,
            isScrolling: true,
          },
          expects: {
            scrollList: 0,
            isScrolling: true,
          },
        },
        {
          setup: {
            scrollLeft: 1000,
            isScrolling: true,
          },
          expects: {
            scrollList: 0,
            isScrolling: true,
          },
        },
        {
          setup: {
            scrollLeft: 0,
            isScrolling: false,
          },
          expects: {
            scrollList: 0,
            isScrolling: false,
          },
        },
        {
          setup: {
            scrollLeft: 1000,
            isScrolling: false,
          },
          expects: {
            scrollList: 1,
            isScrolling: true,
          },
        },
      ])(
        `should test with:
            scrollLeft: $setup.scrollLeft
            isScrolling: $setup.isScrolling`,
        ({ setup, expects }) => {
          component.list.scrollLeft = setup.scrollLeft;
          component.isScrolling = setup.isScrolling;
          const scrollListSpy = jest.spyOn(component, "scrollList").mockReturnValue();
          const scrollAmount = 700;
          component.scrollAmount = scrollAmount;

          component.prev();

          expect(component.isScrolling).toBe(expects.isScrolling);
          if (expects.scrollList > 0) {
            expect(scrollListSpy).toBeCalledWith(-scrollAmount);
          }
        },
      );
    });

    describe("test isLoadingCardsVisible()", () => {
      let listClientWidth: jest.SpyInstance<number>;

      beforeEach(() => {
        listClientWidth = jest.spyOn(component.list, "clientWidth", "get").mockReturnValue(900);
      });

      it("should not show loading cards with showLoadingCards false", () => {
        component.showLoadingCards = false;

        expect(component.isLoadingCardsVisible()).toBeFalsy();
        expect(listClientWidth).not.toBeCalled();
      });

      it("should not show loading cards with the scroll on 0", () => {
        component.list.scrollLeft = 0;

        expect(component.isLoadingCardsVisible()).toBeFalsy();
        expect(listClientWidth).toBeCalled();
      });

      it("should show loading cards with scroll more than the cards width sum", () => {
        component.list.scrollLeft = component.cards.length * component.cardWidth + 500;

        expect(component.isLoadingCardsVisible()).toBeTruthy();
        expect(listClientWidth).toBeCalled();
      });
    });

    describe("test mobileScroll()", () => {
      let scrollListSpy: jest.SpyInstance<void>;

      beforeEach(() => {
        scrollListSpy = jest.spyOn(component, "scrollList").mockReturnValue();
        isMobileMock.mockReturnValue(true);
      });

      it("should not scroll", () => {
        component.isScrolling = true;

        component.mobileScroll();

        expect(component.isScrolling).toBeTruthy();
        expect(scrollListSpy).not.toBeCalled();
      });

      it("should scroll back", () => {
        const scrollBackAmount = 50;
        isMobileMock.mockReturnValue(true);
        component.setListDimensions();
        component.list.scrollLeft = component.cardWidth * 4 + scrollBackAmount;

        component.mobileScroll();

        expect(component.isScrolling).toBeTruthy();
        expect(scrollListSpy).toBeCalledWith(-scrollBackAmount);
      });

      it("should scroll foward", () => {
        const scrollfowaerdAmount = 130;
        isMobileMock.mockReturnValue(true);
        component.setListDimensions();
        component.list.scrollLeft = component.cardWidth * 4 + scrollfowaerdAmount;

        component.mobileScroll();

        expect(component.isScrolling).toBeTruthy();
        expect(scrollListSpy).toBeCalledWith(component.cardWidth - scrollfowaerdAmount);
      });
    });

    describe("test isScrollOnMobile()", () => {
      it.each([
        {
          name: "should not scroll if isn't on mobile",
          setup: {
            isMobile: false,
            isScrolling: false,
            scrollLeft: 0,
          },
          expects: {
            result: false,
          },
        },
        {
          name: "should not scroll if isn't on mobile and it's scrolling",
          setup: {
            isMobile: false,
            isScrolling: true,
            scrollLeft: 0,
          },
          expects: {
            result: false,
          },
        },
        {
          name: "should not scroll when the scroll is on the cards division",
          setup: {
            isMobile: true,
            isScrolling: false,
            scrollLeft: 225 * 4,
          },
          expects: {
            result: false,
          },
        },
        {
          name: "should scroll when past cards division",
          setup: {
            isMobile: true,
            isScrolling: false,
            scrollLeft: 225 * 4 + 40,
          },
          expects: {
            result: true,
          },
        },
        {
          name: "should not scroll on mobile and it's scrolling",
          setup: {
            isMobile: true,
            isScrolling: true,
            scrollLeft: 0,
          },
          expects: {
            result: false,
          },
        },
      ])("$name", ({ setup, expects }) => {
        isMobileMock.mockReturnValue(setup.isMobile);
        component.isScrolling = setup.isScrolling;
        component.list.scrollLeft = setup.scrollLeft;

        expect(component.isScrollOnMobile()).toBe(expects.result);
      });
    });

    describe("test scrollList()", () => {
      it("should scroll the amount passed to the method", () => {
        const scrollBySpy = jest.fn().mockReturnValue(undefined);
        component.list.scrollBy = scrollBySpy;
        const scrollAmount = 500;

        component.scrollList(scrollAmount);

        expect(scrollBySpy).toBeCalledWith({ left: scrollAmount, behavior: "smooth" });
      });
    });
  });
});
