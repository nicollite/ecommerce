import { environment } from "src/environments/environment";
import { Injectable } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { Resolve } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";

export interface IconRef {
  iconName: string;
  url: string;
}

@Injectable({ providedIn: "root" })
/** Class to add icons to Mat Icon Registry */
export class IconResolverService implements Resolve<void> {
  private icon: IconRef[] = environment.icons;

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {}

  public async resolve(): Promise<void> {
    this.icon.forEach(iconRef => {
      this.matIconRegistry.addSvgIcon(
        iconRef.iconName,
        this.domSanitizer.bypassSecurityTrustResourceUrl(iconRef.url),
      );
    });
  }
}
