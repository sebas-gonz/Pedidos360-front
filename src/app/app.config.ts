import { ApplicationConfig, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { BrowserCacheLocation, PublicClientApplication } from '@azure/msal-browser';
import { environment } from '../environments/environment';
import { MSAL_INSTANCE, MsalService } from '@azure/msal-angular';
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { switchMap } from 'rxjs';

export function MSALInstanceFactory(): PublicClientApplication {
  return new PublicClientApplication({
    auth: environment.msalConfig.auth,
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
    }
  });
}

export const customAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const msalService = inject(MsalService);

  if (req.url.includes(environment.apiConfig.uri)) {
    const account = msalService.instance.getActiveAccount() || msalService.instance.getAllAccounts()[0];

    if (account) {
      return msalService.acquireTokenSilent({
        scopes: environment.apiConfig.scopes,
        account: account
      }).pipe(
        switchMap(result => {
          const authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${result.accessToken}` }
          });
          return next(authReq);
        })
      );
    }
  }
  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([customAuthInterceptor])),
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    MsalService,
    provideAppInitializer(() => {
      const msalService = inject(MsalService);
      return msalService.instance.initialize();
    })
  ]
};
