import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BreadCrumbsComponent } from "./bread-crumbs.component";
import { SharedModule } from "../../shared.module";
import { Router } from "@angular/router";

describe("BreadCrumbsComponent", () => {
  let component: BreadCrumbsComponent;
  let fixture: ComponentFixture<BreadCrumbsComponent>;

  let router = {
    navigateByUrl: jest.fn(),
  };

  beforeEach(async () => {
    // Reset mocks between tests
    jest.resetAllMocks();

    await TestBed.configureTestingModule({
      declarations: [BreadCrumbsComponent],
      imports: [SharedModule],
      providers: [{ provide: Router, useValue: router }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadCrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("shoud test navigate", () => {
    component.navigate("url");
    expect(router.navigateByUrl).toBeCalledWith("url");
  });
});
