import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private router: Router) {}
  getAccess_token() {
    if ('token' in localStorage) {
      var token = this.getDataFromLocalStorage('token');
      if (token) return token;
    } else {
      return null;
    }
  }
  // * LocalStorage Function's
  public saveDataInLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getDataFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }
  public removeDataFromLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  public clearDataFromLocalStorage() {
    localStorage.clear();
  }
}
