import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable, map, catchError, finalize } from 'rxjs';
import { FetchInputfeildNameService } from 'src/app/services/fetch-inputfeild-name.service';
import { HttpService } from 'src/app/services/http/http.service';
import { ResponseService } from 'src/app/services/response.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {


  tagsInformation: any;
  isDropdownOpen: boolean = true;
  isDropdownOpenTwo: boolean = false;
  isLoaderShow: boolean = true;
  filteredInsuredList: string[];
  filteredPolicyList: string[];
  apiErrorMessage = 'Bad Request';

  insuredList: string[] = [];
  policyList: string[] = [];
  selectedInsured: any;
  selectedPolicy: any;
  isShown: boolean = false;
  searchKeyword: string = '';
  isClearShow: boolean = true;
  apiError: boolean = false;
  originalFieldName: string | null = null;
  mapkey: any;
  isSuccess: boolean = false;
  successMessage = '';
  activeUrl: any;
  fieldsMappings: any;
  fieldType: any;
  vehicleList: any;
  filteredVehicleList: string[];
  driverList: any;
  filteredDriverList: string[];
  selectedVehicle: any;
  selectedDriver: any;
  adminMappings: any;
  globalCheck = false;

  totalRequests:any = [];
  constructor(
    private http: HttpService,
    private responseService: ResponseService,
    private cdr: ChangeDetectorRef,
    private Injector: Injector,
    private utils: UtilsService,
    private router: Router,
    private location: Location
  ) { 
    const state:any = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
       this.totalRequests = state;
       console.log("Data is =", this.totalRequests);
       this.isLoaderShow = false;
      // Now you can use 'someValue' in your component
    }
  }
  getDataFromStorage(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Retrieve the data from chrome.storage
      chrome.storage.local.get('myData', (result: any) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result.myData);
        }
      });
    });
  }
  getCurrentUrl(): Promise<any> {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentUrl = tabs[0].url;
        resolve(currentUrl);
      });
    });
  }
  // Helper function to check if a string contains any array element
  containsElement(str, elements) {
    if (typeof str !== 'string') return false;
    return elements.some((element) => str.indexOf(element) !== -1);
  }

  editScreen(id, type) {
    this.router.navigate(['/dashboard/edit-mapping'], {
      queryParams: {
        id: id,
        type: type
      },
    });
  }

  
 
  title: string = 'Nowcerts-chrome-ext';
  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }
  getData(): Promise<any> {
    chrome.runtime.onMessage.addListener(function (
      message,
      sender,
      sendResponse
    ) {
      if (message.action === 'openWindowData') {
        var data = message.data;
      }
    });

    return new Promise((resolve) => {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.data) {
          resolve(JSON.parse(message.data));
        }
      });
    });
  }
  ngOnInit(): void {
    this.getCurrentUrl().then((url) => {
      if (url) {
        //this.previousWork(url);

      }
    });

  }

  viewMappings(data:any, from){
    const status = { status:  from};
    this.router.navigate(['/dashboard/view-mappings'], { state: {...data, ...status}
      // queryParams: {
      //   data: data
      // },
    });
  }

 
  transformFieldNames(fieldNames: string[]): string[] {
    const transformedNames = fieldNames.map((fieldName) => {
      // Perform your transformation logic here
      // Example: Convert camelCase and snake_case to Title Case with spaces
      const words = fieldName
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Convert camelCase to Title Case
        .split('_'); // Split snake_case by underscores
      const transformedWords = words.map((word, index) => {
        if (index === 0) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        } else {
          return word.charAt(0).toLowerCase() + word.slice(1);
        }
      });

      return transformedWords.join(' ');
    });
    return transformedNames;
  }


  getValueByKey(keyToCheck: string): any {
    if (this.adminMappings && keyToCheck && this.adminMappings.hasOwnProperty(keyToCheck)) {
      return this.adminMappings[keyToCheck];
    } else {
      return '';
    }
  }

  updateDataFromServer(id, status) {
    const data = {
        status: status
    }
    this.http 
      .putRequest(`nowcerts_extension/nowcerts_field_mappings/${id}/mark_status`, data)
      .pipe(finalize(() => {}))
      .subscribe(
        (res) => {
          if (res.status === 200 || res.status === 201) {
            this.successMessage = 'Successfully '+ status;
            this.isSuccess = true;
            setTimeout(() => {
              chrome.runtime.sendMessage({ action: 'apiSuccess' });
              this.isSuccess = false;
            }, 1500);
            this.goBack();
          }
        },
        (err) => {
          if (err.status === 400 || err.status === 404) {
            this.responseService.openSnackBar('Bad Request', 'error');
          } else {
            this.responseService.openSnackBar(err.message, 'error');
          }
        }
      );
  }
  goBack() {
    this.location.back();
  }
}
