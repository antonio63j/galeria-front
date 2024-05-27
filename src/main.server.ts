/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
*/
import '@angular/localize/init';

import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export { AppServerModule } from './app/app.server.module';
// AFL no necesario, export { renderModuleFactory } from '@angular/platform-server';
export { AppServerModule as default } from '../src/app/app.server.module'; 