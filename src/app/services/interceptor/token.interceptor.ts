import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { UtilsService } from '../utils.service';
import { JwtService } from '../jwt/jwt.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    //handle your auth error or rethrow
    if (err.status === 401) {
      localStorage.clear();
      this.removeStorage();
      this.router.navigate(['/']);
      return of(err.message);
    }
    if (err.status === 403) {
      localStorage.clear();
      this.removeStorage();
      this.router.navigate(['/']);
      return of(err.message);
    }
    if (err.status === 500) {
      return of(err.message);
    }
    if (err.status === 504) {
      return of(err.message);
    }
    if (err.status === 0) {
      return of(err.message);
    }
    return throwError(err);
  }
  constructor(private injector: Injector, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let jwtService = this.injector.get(JwtService);
    let utilsService = this.injector.get(UtilsService);
    if (
      request.url.includes(
        'https://dev.api.20miles.us/api/nowcerts_extension/nowcerts_field_mappings'
      ) ||
      request.url.includes('nowcerts_extension/nc_ext_whitelisted_domains')
    ) {
      let tokenizedReq = request.clone({
        setHeaders: {
          Authorization: `Token ${jwtService.encodeData()}`,
        },
      });
      return next
        .handle(tokenizedReq)
        .pipe(catchError((x) => this.handleAuthError(x)));
    } else {
      let tokenizedReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${utilsService.getAccess_token()}`,
        },
      });
      return next
        .handle(tokenizedReq)
        .pipe(catchError((x) => this.handleAuthError(x)));
    }
  }

  removeStorage(){
    chrome.storage.local.remove(['myData'], function() {
      console.log("Keys removed from local storage.");
    });
    chrome.storage.local.remove(['token'], function() {
      console.log("Keys removed from local storage.");
    });
    chrome.storage.local.remove(['isSimpleFlow'], function() {
      console.log("Keys removed from local storage.");
    });
    chrome.storage.local.remove(['selectedInsured'], function() {
      console.log("Keys removed from local storage.");
    });
    chrome.storage.local.remove(['selectedPolicy'], function() {
      console.log("Keys removed from local storage.");
    });
    chrome.storage.local.remove(['selectedVehicle'], function() {
      console.log("Keys removed from local storage.");
    });
    chrome.storage.local.remove(['selectedDriver'], function() {
      console.log("Keys removed from local storage.");
    });
    chrome.storage.local.remove(['visitUrl'], function() {
      console.log("Keys removed from local storage.");
    });
  }
}
