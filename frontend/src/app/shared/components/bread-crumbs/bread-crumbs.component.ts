import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";

export interface BreadCrumbsPaths {
  name: string;
  path?: string;
}

@Component({
  selector: "app-bread-crumbs",
  templateUrl: "./bread-crumbs.component.html",
  styleUrls: ["./bread-crumbs.component.scss"],
})
export class BreadCrumbsComponent implements OnInit {
  @Input() crumbs: BreadCrumbsPaths[];

  constructor(public router: Router) {}

  ngOnInit(): void {}

  navigate(path: string) {
    this.router.navigateByUrl(path);
  }
}
