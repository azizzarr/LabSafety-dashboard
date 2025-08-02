import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppAlertModule} from "./app/app-alert.module";
import { environment} from "./environments/environment";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppAlertModule)
  .catch(err => console.error(err));
