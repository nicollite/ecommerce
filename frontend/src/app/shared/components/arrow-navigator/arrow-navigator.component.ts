import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-arrow-navigator",
  templateUrl: "./arrow-navigator.component.html",
  styleUrls: ["./arrow-navigator.component.scss"],
})
export class ArrowNavigatorComponent implements OnInit {
  // Direction of the arrow
  @Input() direction: "left" | "right";

  constructor() {}

  ngOnInit(): void {}
}
