import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FetchInputfeildNameService {
  getDataFromStorage(): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('myData', (result: any) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result.myData);
        }
      });
    });
  }

  gettokenFromStorage(): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('token', (result: any) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result.token);
        }
      });
    });
  }
  getActiveUrlFromStorage(): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('visitUrl', (result: any) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result.visitUrl);
        }
      });
    });
  }
  getSimpleFlowBooleanFromStorage(): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('isSimpleFlow', (result: any) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result.isSimpleFlow);
        }
      });
    });
  }
  getInsuredDataFromStorage(): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('selectedInsured', (result: any) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result.selectedInsured);
        }
      });
    });
  }
  getPolicyDataFromStorage(): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('selectedPolicy', (result: any) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result.selectedPolicy);
        }
      });
    });
  }
  getVehicleDataFromStorage(): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('selectedVehicle', (result: any) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result.selectedVehicle);
        }
      });
    });
  }
  getDriverDataFromStorage(): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('selectedDriver', (result: any) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result.selectedDriver);
        }
      });
    });
  }
  getDomainFromStorage(): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('domain', (result: any) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result.domain);
        }
      });
    });
  }
}
