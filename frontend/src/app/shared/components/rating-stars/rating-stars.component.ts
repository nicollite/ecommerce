import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-rating-stars",
  templateUrl: "./rating-stars.component.html",
  styleUrls: ["./rating-stars.component.scss"],
})
export class RatingStarsComponent implements OnInit {
  @Input() numberOfStars: number = 5;
  @Input() rate: number = 0;

  stars: string[];

  constructor() {}

  ngOnInit(): void {
    this.stars = Array.from({ length: this.numberOfStars }, (_, i) => {
      if (i + 1 <= this.rate) return "rating-star";
      if (i < this.rate) return "rating-star-half";
      return "rating-star-empty";
    });
  }
}
