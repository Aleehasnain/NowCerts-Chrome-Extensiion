import { Injectable, Injector } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

import { FetchInputfeildNameService } from './../services/fetch-inputfeild-name.service';

@Injectable({
  providedIn: 'root',
})
export class RecheckedGuard implements CanActivate {
  constructor(private router: Router, private Injector: Injector) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let inputfeilsname = this.Injector.get(FetchInputfeildNameService);
    const result = inputfeilsname.getActiveUrlFromStorage().then((data) => {
      const ishown = this.getCurrentUrl().then((url) => {
        const domain = localStorage.getItem('domain');
        if (domain && url.includes(domain)) {
          chrome.storage.local.set({ isSimpleFlow: false });
          this.router.navigate(['/dashboard/list']);
          return false;
        } else {
          localStorage.removeItem('domain');
          return true;
        }
      });
      return ishown;
    });
    return result;
  }
  getCurrentUrl(): Promise<any> {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentUrl = tabs[0].url;
        resolve(currentUrl);
      });
    });
  }
}
