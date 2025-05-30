import { Injectable, Injector } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { FetchInputfeildNameService } from './../services/fetch-inputfeild-name.service';

@Injectable({
  providedIn: 'root',
})
export class PopupguardGuard implements CanActivate {
mapkey: any;
  flag: boolean;

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
    const result = inputfeilsname.getDataFromStorage().then((data) => {
       const isvalid = inputfeilsname.gettokenFromStorage().then((storeToken) => {
        this.mapkey = data ? data.namefeild : null;
        if (this.mapkey) {
          this.router.navigate(['/listing']); // Redirect to the listing page if map.key exists
          return false;}
         else if(!this.mapkey && storeToken ){
          this.router.navigate(['/dashboard']); // Redirect to the listing page if map.key exists
          return false;
         }
         else {
         return true;
        }
      });
      return isvalid;
       });

    return result;
  }

}
