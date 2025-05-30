import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
  activeUrl;
  policyData: any = null;
  isLoaderShow: boolean = true;
  isFieldsMappingEmpty: boolean = false;
  loggedData: any = '';
  isNotWhite: any;
  ableToMapping = false;
  enableDisable: boolean = false;
  autofillEnabled: boolean = localStorage.getItem('autofillEnabled') === 'false' ? false : true;
 fieldsMappings = null;
  ngOnInit(): void {
    const storedEnabledString = localStorage.getItem('autofillEnabled');
    this.autofillEnabled = storedEnabledString === 'false' ? false : true;
    this.getCurrentUrl().then((url) => {
      this.activeUrl = url;
      if (this.activeUrl) {
        this.checkWebUrl(url);
        this.getRequestFromServer(this.activeUrl);
      }
    });
    this.loggedData = this.utils.getDataFromLocalStorage('loggedData');
    this.isNotWhite = this.utils.getDataFromLocalStorage('domain');
    console.log('Domain', this.isNotWhite);
  }
  constructor(private http: HttpService, private utils: UtilsService) {
    localStorage.setItem('myKey', 'myValue');

  }

  onClick(event: Event) {
    var target: any = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.attributes.id;
    var value = idAttr.nodeValue;
    var config = { somebigobject: 'complicated value' };
    // chrome.tabs.executeScript(
    //   {
    //     //send the value to be used by our script
    //     // code: `var value = ${intValue};`
    //     code: 'var config = ' + JSON.stringify(config),
    //   },
    //   function () {
    //     //run the script in the file injector.js
    //     chrome.tabs.executeScript({
    //       file: 'injector.js',
    //     });
    //     //   var data = Array.from(document.getElementsByTagName('input'))

    //   }
    // );
    const urlObject = new URL(this.activeUrl);
    const domain = urlObject.hostname;
    localStorage.setItem('domain', domain.toString());
  }

  getRequestFromServer(url) {
    this.isLoaderShow = true;
    this.http
      .getRequest(
        `nowcerts_extension/nowcerts_field_mappings/fetch_mapping?page_url=${
          url.split('?')[0]
        }`
      )
      .pipe(
        finalize(() => {
          this.isLoaderShow = false;
        })
      )
      .subscribe(
        (res) => {
          if (res) {
            this.policyData = JSON.parse(res.body);
            console.log(this.policyData);
            this.isFieldsMappingEmpty = this.isObjectEmpty(
              this.policyData?.field_mapping?.fields_mapping
            );
            this.utils.saveDataInLocalStorage(
              'feilsMapping',
              this.policyData?.field_mapping?.fields_mapping
            );
            chrome.storage.local.set({ isSimpleFlow: true });
            chrome.storage.local.set({ visitUrl: '' });
            chrome.storage.local.set({ selectedInsured: '' });
            chrome.storage.local.set({ selectedPolicy: '' });
            chrome.storage.local.set({ selectedVehicle: '' });
            chrome.storage.local.set({ selectedDriver: '' });
          }
        },
        (error) => {
          this.policyData = null;
        }
      );
  }
  makeWhiteList() {
    this.isLoaderShow = true;
    const parsedURL = new URL(this.activeUrl);
    const domainName = parsedURL.hostname;
    // console.log('Active URL: ', domainName);
    // const domainName = parsedURL.href;
    console.log('Active URL make white list: ', domainName);
    // console.log('Active URL make white list: ', parsedURL);
    // this.http
    //   .postRequest(`nowcerts_extension/nc_ext_whitelisted_domains.json`, {
    //     domain: domainName,
    //   })
    this.http
    .getRequest(`nowcerts_extension/nc_ext_whitelisted_domains.json?skip_pagination=true`)
      .pipe(
        finalize(() => {
          this.isLoaderShow = false;
        })
      )
      .subscribe(
        (res:any) => {
          if (res) {
            if (res.status === 200) {
              console.log('WhiteListed');
              this.ngOnInit();
            }
          }
        },
        (error) => {
          this.policyData = null;
        }
      );
  }

  checkWebUrl(url) {
    this.http
      .getRequest(`nowcerts_extension/nc_ext_whitelisted_domains?skip_pagination=true`)
      .pipe(finalize(() => {}))
      .subscribe(
        (response: any) => {
          const data = JSON.parse(response.body);
          console.log('Data',data)
          if (data.whitelisted_domains && data.whitelisted_domains.length) {
            const parsedURL = new URL(url);
            const domainName = parsedURL.hostname;
            for (
              let index = 0;
              index < data.whitelisted_domains.length;
              index++
            ) {
              const element = data.whitelisted_domains[index];
              console.log('Check the datat URL: ', element);
              if (domainName.toLowerCase() == element.domain.toLowerCase()) {
                console.log('Check the datat URL domainName: ', domainName);
                debugger;
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
  getCurrentUrl(): Promise<any> {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentUrl = tabs[0].url;
        console.log('Geting Current Url ==>', currentUrl);
        resolve(currentUrl);
      });
    });
  }

  isObjectEmpty(obj: any): boolean {
    return obj && Object.keys(obj).length === 0;
  }

  enableDisableAutoFill() {
    // this.enableDisable = !this.enableDisable;
    // this.enableDisable = true;
    // const disable = true
    // let setValue =localStorage.setItem('disabalebtn', JSON.stringify(disable))
    // let abc = localStorage.getItem('disabalebtn');
    // let y = JSON.parse(storedValue);
    // alert(abc);

    // const storedValue = localStorage.getItem('isFlag');
    // const isFlag = JSON.parse(storedValue);

    // if(this.enableDisable == true){
    //   alert(' auto fill is enable');

    // }else{
    //   alert(' auto fill is disable');
    // }

    const isFlag = true;
    localStorage.setItem('isFlags', JSON.stringify(isFlag));
  }
  
  toggleAutofill() {
    const enabled = this.autofillEnabled;
    localStorage.setItem('autofillEnabled', enabled.toString());
  
    // Get the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.id !== undefined) {
        // Send a message to the content script
        if(enabled === true){
        chrome.tabs.sendMessage(activeTab.id, { enabled });
  
        // Reload the current active tab to apply changes
        chrome.tabs.reload(activeTab.id);
      } else {
        chrome.tabs.sendMessage(activeTab.id, { enabled });
      }
      } else {
        console.error("Unable to determine the active tab or its ID.");
      }
    });
  }
}
