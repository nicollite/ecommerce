import { NgModule, ModuleWithProviders } from "@angular/core";

// Modules
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedMaterialModule } from "./shared-material.module";
import { HttpClientModule } from "@angular/common/http";
import { NgbCarouselModule } from "@ng-bootstrap/ng-bootstrap";

// Components, pipes and directives
import { components } from "./components/components";
import { pipes } from "./pipes/pipes";
import { directives } from "./directives/directives";

const declarations_exports = [...components, ...pipes, ...directives];

@NgModule({
  declarations: declarations_exports,
  entryComponents: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    NgbCarouselModule,
  ],
  exports: [...declarations_exports, FormsModule, ReactiveFormsModule, HttpClientModule],
})
export class SharedModule {}
