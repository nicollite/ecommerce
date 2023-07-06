export interface ProductCardData {
  name: string;
  productId: string;
  mainImgSrc: string;
  pricing: Pricing;
  freeShipping?: boolean;
}

export interface Pricing {
  original_price: number;
  price: number;
  installments: {
    amount: number;
    total_value: number;
  };
}
