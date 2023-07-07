import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RatingStarsComponent } from "./rating-stars.component";
import { SharedModule } from "../../shared.module";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MatIconTestingModule } from "@angular/material/icon/testing";

describe("RatingStarsComponent", () => {
  let component: RatingStarsComponent;
  let fixture: ComponentFixture<RatingStarsComponent>;

  beforeEach(async () => {
    // Reset mocks between tests
    jest.resetAllMocks();

    await TestBed.configureTestingModule({
      declarations: [RatingStarsComponent],
      imports: [SharedModule, MatIconTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingStarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();

    expect(component.stars.length).toBe(5);
  });

  describe("test stars rates and quantities", () => {
    it.each([
      {
        setup: {
          starNumbers: 5,
          rate: 5,
        },
        expects: {
          stars: {
            "rating-star": 5,
            "rating-star-half": 0,
            "rating-star-empty": 0,
          },
        },
      },
      {
        setup: {
          starNumbers: 5,
          rate: 4,
        },
        expects: {
          stars: {
            "rating-star": 4,
            "rating-star-half": 0,
            "rating-star-empty": 1,
          },
        },
      },
      {
        setup: {
          starNumbers: 5,
          rate: 3.1,
        },
        expects: {
          stars: {
            "rating-star": 3,
            "rating-star-half": 1,
            "rating-star-empty": 1,
          },
        },
      },
      {
        setup: {
          starNumbers: 5,
          rate: 1.2,
        },
        expects: {
          stars: {
            "rating-star": 1,
            "rating-star-half": 1,
            "rating-star-empty": 3,
          },
        },
      },
      {
        setup: {
          starNumbers: 3,
          rate: 1.2,
        },
        expects: {
          stars: {
            "rating-star": 1,
            "rating-star-half": 1,
            "rating-star-empty": 1,
          },
        },
      },
      {
        setup: {
          starNumbers: 3,
          rate: 2.2,
        },
        expects: {
          stars: {
            "rating-star": 2,
            "rating-star-half": 1,
            "rating-star-empty": 0,
          },
        },
      },
    ])(
      `should test with $setup.starNumbers stars with rate $setup.rate and expecting:
        $expects.stars
    `,
      ({ setup, expects }) => {
        component.numberOfStars = setup.starNumbers;
        component.rate = setup.rate;

        component.ngOnInit();

        expect(component.stars.length).toBe(setup.starNumbers);

        // Test each key in expects.stars
        Object.entries(expects.stars).forEach(([key, value]) => {
          const starTypeAmount = component.stars.filter(s => s === key).length;
          expect(starTypeAmount).toBe(value);
        });
      },
    );
  });
});
