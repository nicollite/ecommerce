const mockEnv = {
  icons: [],
};

jest.mock("src/environments/environment", () => ({ environment: mockEnv }));

import { TestBed } from "@angular/core/testing";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

import { IconResolverService } from "./icon-resolver.service";

describe("IconResolverService", () => {
  let service: IconResolverService;

  let matIconRegistry = {
    addSvgIcon: jest.fn(),
  };

  let domSanitizer = {
    bypassSecurityTrustResourceUrl: jest.fn(),
  };

  beforeEach(() => {
    mockEnv.icons = [
      { iconName: "icon-1", url: "url1" },
      { iconName: "icon-2", url: "url2" },
    ];

    TestBed.configureTestingModule({
      providers: [
        IconResolverService,
        { provide: MatIconRegistry, useFactory: () => matIconRegistry },
        { provide: DomSanitizer, useFactory: () => domSanitizer },
      ],
    });

    service = TestBed.inject(IconResolverService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should test resolve service", async () => {
    await service.resolve();

    expect(matIconRegistry.addSvgIcon).toBeCalledTimes(2);
    expect(domSanitizer.bypassSecurityTrustResourceUrl).toBeCalledTimes(2);
  });
});
