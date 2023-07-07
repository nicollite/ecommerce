import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "./pages/home/home.component";

import { IconResolverService } from "./core/services/resolvers/icon-resolver.service";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    resolve: {
      icon: IconResolverService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
