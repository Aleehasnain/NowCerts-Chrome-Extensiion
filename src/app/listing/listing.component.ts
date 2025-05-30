import {
  AfterContentChecked,
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import { HttpService } from 'src/app/services/http/http.service';
import { ResponseService } from 'src/app/services/response.service';
import { FetchInputfeildNameService } from './../services/fetch-inputfeild-name.service';
import { Injectable, Injector } from '@angular/core';
import { Observable, finalize, catchError, map } from 'rxjs';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css'],
})
export class ListingComponent implements AfterViewChecked {
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
  isInsured: boolean = false;
  isPolicy: boolean = true;
  isVehicle: boolean = true;
  isDriver: boolean = true;
  groupName: string;
  apiError: boolean = false;
  searchKeyword: string = '';
  isClearShow: boolean = true;
  originalInsuredList: string[] = [];
  originalPolicyList: string[] = [];
  originalFieldName: string | null = null;
  mapkey: any;
  isDisabled: boolean = false;
  isSuccess: boolean = false;
  mapButtonText: string = 'Map';
  successMessage = '';
  activeUrl: any;
  private port: chrome.runtime.Port;
  fieldsMappings: any;
  fieldType: any;
  isDropdownOpenThree: any;
  vehicleList: any;
  filteredVehicleList: string[];
  driverList: any;
  filteredDriverList: string[];
  selectedVehicle: any;
  isDropdownOpenFour: boolean;
  selectedDriver: any;
  header: boolean = true;
  isheader: boolean = true;
  constructor(
    private http: HttpService,
    private responseService: ResponseService,
    private cdr: ChangeDetectorRef,
    private Injector: Injector,
    private utils: UtilsService
  ) {}
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
  ngOnInit(): void {
    let inputfeilsname = this.Injector.get(FetchInputfeildNameService);
    inputfeilsname.getDataFromStorage().then((data) => {
      this.mapkey = data ? data.namefeild : null;
      this.activeUrl = data ? data.url : null;
      this.fieldType = data ? data.fieldtype : null;
      forkJoin({
        mappingResponse: this.getMappingFromServer(),
        requestResponse: this.getRequestFromServer(this.activeUrl),
      }).subscribe(
        ({ mappingResponse, requestResponse }) => {
          // Both API calls were successful
          if (!(this.mapkey in this.fieldsMappings)) {
            this.isDisabled = false;
          } else {
            this.isDisabled = true;
            const matchedKey = this.mapkey;
            const matchedValue = this.fieldsMappings[matchedKey];
            if (matchedValue) {
              this.mapButtonText = 'Update';
              const words = matchedValue.split('.');
              if (words[0] === 'insured') {
                this.selectedInsured = this.transformFieldNames([words[1]])[0];
                if (this.selectedInsured) {
                  this.isInsured = false;
                  this.isDropdownOpen = true;
                }
                this.originalFieldName = `insured.${
                  this.insuredList[
                    this.filteredInsuredList.indexOf(this.selectedInsured)
                  ]
                }.${this.fieldType}`;
              } else if (words[0] === 'policy') {
                this.selectedPolicy = this.transformFieldNames([words[1]])[0];
                if (this.selectedPolicy) {
                  this.isDropdownOpenTwo = true;
                  this.isPolicy = false;
                }
                this.originalFieldName = `policy.${
                  this.policyList[
                    this.filteredPolicyList.indexOf(this.selectedPolicy)
                  ]
                }.${this.fieldType}`;
              } else if (words[0] === 'vehicle') {
                this.selectedVehicle = this.transformFieldNames([words[1]])[0];
                if (this.selectedVehicle) {
                  this.isDropdownOpenThree = true;
                  this.isVehicle = false;
                }
                this.originalFieldName = `vehicle.${
                  this.vehicleList[
                    this.filteredVehicleList.indexOf(this.selectedVehicle)
                  ]
                }.${this.fieldType}`;
              } else if (words[0] === 'driver') {
                this.selectedDriver = this.transformFieldNames([words[1]])[0];
                if (this.selectedDriver) {
                  this.isDropdownOpenFour = true;
                  this.isDriver = false;
                }
                this.originalFieldName = `driver.${
                  this.driverList[
                    this.filteredDriverList.indexOf(this.selectedDriver)
                  ]
                }.${this.fieldType}`;
              }
            }
          }
          this.isLoaderShow = false;
        },
        (error: HttpErrorResponse) => {
          if (typeof error.error === 'string') {
            const res = JSON.parse(error?.error);
            console.error('API calls failed:', res);
            console.error('API calls failed:', res.message);
          }
        }
      );
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
        // Handle the received data in your Angular application
        console.log('Received data:', data);
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
  itemGroups: { label: string; items: string[] }[] = [];
  selectedItem: string = '';

  handleItemClick(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedItem = target.value;
    this.selectedItem = selectedItem;
    this.isShown = false;
  }

  getMappingFromServer(): Observable<any> {
    return this.http
      .getRequest('nowcerts_extension/nowcerts_field_mappings/fields.json')
      .pipe(
        map((res) => {
          if (res.status === 200 || res.status === 201) {
            var data = JSON.parse(res.body);
            console.log('Feiiiiiiiiiiiiiilds');
            console.log(data);
            this.insuredList = data.fields.fields_names.insured;
            this.filteredInsuredList = this.transformFieldNames(
              data.fields.fields_names.insured
            );
            this.policyList = data.fields.fields_names.policy;
            this.filteredPolicyList = this.transformFieldNames(
              data.fields.fields_names.policy
            );
            this.vehicleList = data.fields.fields_names.vehicle;
            this.filteredVehicleList = this.transformFieldNames(
              data.fields.fields_names.vehicle
            );
            this.driverList = data.fields.fields_names.driver;
            this.filteredDriverList = this.transformFieldNames(
              data.fields.fields_names.driver
            );
          }
          return res;
        }),
        catchError((err) => {
          this.apiError = true;
          if (err.status === 400 || err.status === 404) {
            this.apiErrorMessage = 'Bad Request';
          } else {
            this.apiErrorMessage = 'System Error';
          }
          throw err;
        })
      );
  }
  getRequestFromServer(url): Observable<any> {
    return this.http
      .getRequest(
        `nowcerts_extension/nowcerts_field_mappings/fetch_mapping?page_url=${
          url.split('?')[0]
        }`
      )
      .pipe(
        map((res) => {
          if (res) {
            const result = JSON.parse(res.body);
            this.fieldsMappings = result.field_mapping.fields_mapping;
            chrome.storage.local.set({ fieldsMappings: this.fieldsMappings });
            console.log('PreFilledMapping', this.fieldsMappings);
            console.log(result);
            this.utils.saveDataInLocalStorage(
              'feilsMapping',
              this.fieldsMappings
            );
          }
          return res;
        }),
        catchError((err) => {
          this.apiError = true;
          if (err.status === 400 || err.status === 404) {
            this.apiErrorMessage = 'Bad Request';
          } else {
            this.apiErrorMessage = 'System Error';
          }
          throw err;
        })
      );
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

  saveReference() {
    const parsedUrl = new URL(this.activeUrl);
    const domainName = parsedUrl.hostname;
    if (this.originalFieldName) {
      const data = {
        nowcerts_field_mapping: {
          domain: domainName,
          page_url: this.activeUrl.split('?')[0],
          fields_mapping: {},
        },
      };
      data.nowcerts_field_mapping.fields_mapping[this.mapkey] =
        this.originalFieldName;
      this.successMessage = 'Successfully Mapped';
      this.mapAndUnmap(data);
    } else {
      this.isShown = true;
    }
  }

  removeReference() {
    const parsedUrl = new URL(this.activeUrl);
    const domainName = parsedUrl.hostname;
    if (this.originalFieldName) {
      const data = {
        nowcerts_field_mapping: {
          domain: domainName,
          page_url: this.activeUrl.split('?')[0],
          fields_mapping: {},
        },
      };
      data.nowcerts_field_mapping.fields_mapping[this.mapkey] = '';
      this.successMessage = 'Successfully UnMapped';
      this.mapAndUnmap(data);
    } else {
      this.isShown = true;
    }
  }

  mapAndUnmap(data) {
    this.http
      .postRequest('nowcerts_extension/nowcerts_field_mappings.json', data)
      .subscribe(
        (res) => {
          if (res.status === 200 || res.status === 201) {
            this.isSuccess = true;
            setTimeout(() => {
              chrome.runtime.sendMessage({ action: 'apiSuccess' });
            }, 3000);
          }
        },
        (err) => {
          if (err.status === 400 || err.status === 403) {
            this.responseService.openSnackBar('Bad Request', 'error');
          } else {
            const msg = JSON.parse(err.error);
            this.responseService.openSnackBar(msg.message[0], 'error');
          }
        }
      );
  }
  getGroupName(): any {
    var data = this.itemGroups.find((e) => {
      if (e.items.includes(this.selectedItem)) return e?.label;
    });
    return data?.label.toLowerCase() || undefined;
  }
  handleSearch() {
    if (this.searchKeyword) {
      this.isClearShow = false;
    } else {
      this.isClearShow = true;
    }
    // Filter the insured list based on the search keyword
    this.filteredInsuredList = this.insuredList.filter((item) =>
      item.toLowerCase().includes(this.searchKeyword.toLowerCase())
    );
    this.filteredInsuredList = this.transformFieldNames(
      this.filteredInsuredList
    );
    if (this.filteredInsuredList) {
      this.isInsured = false;
    } else {
      this.isInsured = true;
    }

    // Filter the policy list based on the search keyword
    this.filteredPolicyList = this.policyList.filter((item) =>
      item.toLowerCase().includes(this.searchKeyword.toLowerCase())
    );
    this.filteredPolicyList = this.transformFieldNames(this.filteredPolicyList);
    if (this.filteredPolicyList) {
      this.isPolicy = false;
    } else {
      this.isPolicy = true;
    }

    this.filteredVehicleList = this.vehicleList.filter((item) =>
      item.toLowerCase().includes(this.searchKeyword.toLowerCase())
    );
    this.filteredVehicleList = this.transformFieldNames(
      this.filteredVehicleList
    );
    if (this.filteredVehicleList) {
      this.isVehicle = false;
    } else {
      this.isVehicle = true;
    }

    this.filteredDriverList = this.driverList.filter((item) =>
      item.toLowerCase().includes(this.searchKeyword.toLowerCase())
    );
    this.filteredDriverList = this.transformFieldNames(this.filteredDriverList);
    if (this.filteredDriverList) {
      this.isDriver = false;
    } else {
      this.isDriver = true;
    }
  }
  clearSearch() {
    this.searchKeyword = ''; // Clear the search keyword
    this.handleSearch(); // Trigger the search function to update the filtered lists
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.isInsured = !this.isInsured;
  }
  toggleDropdownTwo() {
    this.isDropdownOpenTwo = !this.isDropdownOpenTwo;
    this.isPolicy = !this.isPolicy;
  }
  toggleDropdownThree() {
    this.isDropdownOpenThree = !this.isDropdownOpenThree;
    this.isVehicle = !this.isVehicle;
  }
  toggleDropdownHeader() {
    this.header = !this.header;
    this.isheader = !this.isheader;
  }
  toggleDropdownFour() {
    this.isDropdownOpenFour = !this.isDropdownOpenFour;
    this.isDriver = !this.isDriver;
  }

  handleSelection(event: any, type: string) {
    const selectedValue = event.target.value;
    if (type === 'insured') {
      if (this.selectedInsured === selectedValue) {
        this.selectedInsured = '';
      } else {
        this.selectedInsured = selectedValue;
        this.originalFieldName = `insured.${
          this.insuredList[
            this.filteredInsuredList.indexOf(this.selectedInsured)
          ]
        }.${this.fieldType}`;
      }
      this.selectedPolicy = null;
      this.selectedVehicle = null;
      this.selectedDriver = null;
    } else if (type === 'policy') {
      if (this.selectedPolicy === selectedValue) {
        this.selectedPolicy = '';
      } else {
        this.selectedPolicy = selectedValue;
        this.originalFieldName = `policy.${
          this.policyList[this.filteredPolicyList.indexOf(this.selectedPolicy)]
        }.${this.fieldType}`;
      }
      this.selectedInsured = null;
      this.selectedVehicle = null;
      this.selectedDriver = null;
    } else if (type === 'vehicle') {
      if (this.selectedVehicle === selectedValue) {
        this.selectedVehicle = '';
      } else {
        this.selectedVehicle = selectedValue;
        this.originalFieldName = `vehicle.${
          this.vehicleList[
            this.filteredVehicleList.indexOf(this.selectedVehicle)
          ]
        }.${this.fieldType}`;
      }

      this.selectedInsured = null;
      this.selectedPolicy = null;
      this.selectedDriver = null;
    } else if (type === 'driver') {
      if (this.selectedDriver === this.selectedDriver) {
        this.selectedDriver = '';
      } else {
        this.selectedDriver = selectedValue;
        this.originalFieldName = `driver.${
          this.driverList[this.filteredDriverList.indexOf(this.selectedDriver)]
        }.${this.fieldType}`;
      }
      this.selectedInsured = null;
      this.selectedVehicle = null;
      this.selectedPolicy = null;
    }
  }
}
