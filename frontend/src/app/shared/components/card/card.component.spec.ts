import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CardComponent } from "./card.component";

const productMock = {
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

describe("CardComponent", () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    // Reset mocks between tests
    jest.resetAllMocks();

    await TestBed.configureTestingModule({
      declarations: [CardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;

    component.product = productMock;

    fixture.detectChanges();
  });

  beforeEach(() => {});

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should test discountPercentage prop", () => {
    component.product.pricing.original_price = 1000;
    component.product.pricing.price = 750;

    expect(component.discountPercentage).toBe(25);

    component.product = undefined;
    expect(component.discountPercentage).toBeUndefined();
  });
});
