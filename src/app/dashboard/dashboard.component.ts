import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../services/http/http.service';
import { finalize } from 'rxjs';
import { UtilsService } from '../services/utils.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  ableToMapping = false;
  activeURL = window.location.hostname;
  loggedData: any;

  constructor(
    private router: Router,
    private http: HttpService,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {
    chrome.storage.local.set({ autofill: false });
    this.getCurrentUrl().then((url) => {
      this.activeURL = url;
      if (this.activeURL) {
        this.checkWebUrl(this.activeURL);
      }
    });
    this.loggedData = this.utils.getDataFromLocalStorage('loggedData');
  }
  getCurrentUrl(): Promise<any> {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentUrl = tabs[0].url;
        resolve(currentUrl);
      });
    });
  }

  logout() {
    localStorage.clear();
    chrome.storage.local.remove(['myData'], function () {
      console.log('Keys removed from local storage.');
    });
    chrome.storage.local.remove(['token'], function () {
      console.log('Keys removed from local storage.');
    });
    chrome.storage.local.remove(['isSimpleFlow'], function () {
      console.log('Keys removed from local storage.');
    });
    chrome.storage.local.remove(['selectedInsured'], function () {
      console.log('Keys removed from local storage.');
    });
    chrome.storage.local.remove(['selectedPolicy'], function () {
      console.log('Keys removed from local storage.');
    });
    chrome.storage.local.remove(['selectedVehicle'], function () {
      console.log('Keys removed from local storage.');
    });
    chrome.storage.local.remove(['selectedDriver'], function () {
      console.log('Keys removed from local storage.');
    });
    chrome.storage.local.remove(['visitUrl'], function () {
      console.log('Keys removed from local storage.');
    });

    this.router.navigate(['/']);
  }
  goBack() {
    chrome.storage.local.set({ isSimpleFlow: true });
    chrome.storage.local.set({ visitUrl: '' });
    this.router.navigate(['/dashboard']);
  }
  allMapping() {
    if (this.loggedData?.role === 'staff') {
      this.router.navigate(['/dashboard/all-mapping']);
    } else {
      this.router.navigate(['/dashboard/mapping-categories']);
    }
  }

  checkWebUrl(url) {
    this.http
      .getRequest(`nowcerts_extension/nc_ext_whitelisted_domains`)
      .pipe(finalize(() => {}))
      .subscribe(
        (response: any) => {
          const data = JSON.parse(response.body);
          if (data.whitelisted_domains && data.whitelisted_domains.length) {
            const parsedURL = new URL(url);
            const domainName = parsedURL.hostname;
            for (
              let index = 0;
              index < data.whitelisted_domains.length;
              index++
            ) {
              const element = data.whitelisted_domains[index];

              if (domainName.toLowerCase() == element.domain.toLowerCase()) {
                // Show Map button only when current web is eligible in our whitlelisted domains
                this.utils.saveDataInLocalStorage('domain', 'true');
                this.ableToMapping = true;
              }
            }
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }
  enableAuto() {
    chrome.storage.local.set({ autofill: true });
  }
}
