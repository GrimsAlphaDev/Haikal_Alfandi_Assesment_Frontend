import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideState, provideStore } from '@ngrx/store';
import { bannerReducer } from './state/banners/banners.reducer';
import { provideEffects } from '@ngrx/effects';
import { BannerEffects } from './state/banners/banner.effects';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withInterceptors([authInterceptor])), provideStore(), provideState('banners', bannerReducer), provideEffects([BannerEffects])]
}
