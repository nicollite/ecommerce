import { NgModule, ModuleWithProviders } from "@angular/core";

// Modules
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedMaterialModule } from "./shared-material.module";

// Components

// Pipes
import { pipes } from "./pipes/pipes";

// Directives
import { directives } from "./directives/directives";
import { HttpClientModule } from "@angular/common/http";

const declarations_exports = [...pipes, ...directives];

@NgModule({
  declarations: declarations_exports,
  entryComponents: [],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedMaterialModule],
  exports: [...declarations_exports, FormsModule, ReactiveFormsModule, HttpClientModule],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [],
    };
  }
}
