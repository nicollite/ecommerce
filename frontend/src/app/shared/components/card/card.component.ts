import { Component, Input } from "@angular/core";

import { ProductCardData } from "shared";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
})
export class CardComponent {
  /** Width of the card */
  static cardWidth: number = 220;
  /** Width of the card on mobile */
  static cardWidthMobile: number = 160;

  @Input()
  product: ProductCardData;

  get discountPercentage(): number {
    if (!this.product) return;
    const priceRatio = parseFloat(
      (this.product.pricing.price / this.product.pricing.original_price).toFixed(4),
    );
    return Math.floor(parseFloat((1 - priceRatio).toFixed(2)) * 100);
  }

  constructor() {}
}
