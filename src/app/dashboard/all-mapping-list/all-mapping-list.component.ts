import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable, map, catchError } from 'rxjs';
import { FetchInputfeildNameService } from 'src/app/services/fetch-inputfeild-name.service';
import { HttpService } from 'src/app/services/http/http.service';
import { ResponseService } from 'src/app/services/response.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-all-mapping-list',
  templateUrl: './all-mapping-list.component.html',
  styleUrls: ['./all-mapping-list.component.css'],
})
export class AllMappingListComponent implements OnInit {


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
  constructor(
    private http: HttpService,
    private responseService: ResponseService,
    private cdr: ChangeDetectorRef,
    private Injector: Injector,
    private utils: UtilsService,
    private router: Router,
  ) { }
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

  staffCalculation(){

  }
  previousWork(myUrl) {
    const loggedData = localStorage.getItem('loggedData');
    const loggedObj = JSON.parse(loggedData!);
    let inputfeilsname = this.Injector.get(FetchInputfeildNameService);
    inputfeilsname.getDataFromStorage().then((data) => {
      this.mapkey = data ? data.namefeild : null;
      this.activeUrl = myUrl;
      this.fieldType = data ? data.fieldtype : null;
      forkJoin({
        mappingResponse: this.getMappingFromServer(),
        requestResponse: this.getRequestFromServer(this.activeUrl),
      }).subscribe(
        ({ mappingResponse, requestResponse }) => {

          const demo = JSON.parse(mappingResponse.body);
          let mapResponse: any = [
            ...demo.fields.fields_names.insured,
            ...demo.fields.fields_names.policy,
            ...demo.fields.fields_names.vehicle,
            ...demo.fields.fields_names.driver
          ];;
          if(loggedObj.role ==='admin'){
            const demo1 = JSON.parse(requestResponse.body);
            const mapRequest = demo1.field_mapping.fields_mapping;
            this.adminMappings = demo1.field_mapping.admin_mapping;
  
            mapResponse = mapResponse.map((name) => ({
              name,
              isMapped: false,
              inputKey: ''
            }));
            // Both API calls were successful
            // Iterate over each element in arrayData and set the isMapped property
            const updatedArrayData = mapResponse.map((item: any) => {
              const { name } = item;
              let isMapped = false;
              let ableToUnmap = false;
              let inputKey = '';
              let inputType = ''

  
              for (const [key, value] of Object.entries(mapRequest)) {
                if (key && mapRequest && mapRequest[key] && mapRequest[key] !== undefined && mapRequest[key] != '') {
                  if (this.containsElement(value, [name])) {
                    inputKey = key;
                    isMapped = true;
                    ableToUnmap = true;
                    this.globalCheck = true;
                    if (typeof value === 'string') {
                      const parts = value.split(".");
                      inputType = parts[parts.length - 1];
                    }
                  }
                 
                } else {
                  inputKey = '';
                  isMapped = false;
                  ableToUnmap = false;
                  inputType = '';
                }
  
                if (this.containsElement(value, [name])) {
                  break;
                }
              }
              return { name, isMapped, inputKey, inputType, ableToUnmap };
            });
            this.filteredInsuredList = updatedArrayData;
          }else{
            const demo1 = JSON.parse(requestResponse.body);
            const mapRequest = demo1.field_mapping.mapped_data;
            this.adminMappings = demo1.field_mapping.admin_mapping;
  
            mapResponse = mapResponse.map((name) => ({
              name,
              isMapped: false,
              inputKey: ''
            }));
            // Both API calls were successful
            // Iterate over each element in arrayData and set the isMapped property
            const updatedArrayData = mapResponse.map((item: any) => {
              const { name } = item;
              let isMapped = false;
              let ableToUnmap = false;
              let inputKey = '';
              let inputType = ''
  
              for (const [key, value] of Object.entries(mapRequest)) {
                if (key && mapRequest && mapRequest[key] && mapRequest[key] !== undefined && mapRequest[key] != '') {
                  const valueArray = Array.isArray(value) ? value : [value];
                  if (this.containsElement(valueArray[0], [name])) {
                    inputKey = key;
                    isMapped = true;
                    this.globalCheck = true;
                    if(valueArray[1] === false){
                      ableToUnmap = true;
                    }else{
                      ableToUnmap = false
                    }
                   
                    if (typeof valueArray[0] === 'string') {
                      const parts = valueArray[0].split(".");
                      inputType = parts[parts.length - 1];
                    }
                  }
                 
                } else {
                  inputKey = '';
                  isMapped = false;
                  inputType = '';
                  ableToUnmap = false;
                }
  
                if (this.containsElement(value, [name])) {
                  break;
                }
              }
              return { name, isMapped, inputKey, inputType, ableToUnmap };
            });
            this.filteredInsuredList = updatedArrayData;
          }
          
          
          console.log("My Mappings", this.filteredInsuredList);
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
  ngOnInit(): void {
    this.getCurrentUrl().then((url) => {
      if (url) {
        this.previousWork(url);

      }
    });

  }

  getMappingFromServer(): Observable<any> {
    return this.http
      .getRequest('nowcerts_extension/nowcerts_field_mappings/fields.json')
      .pipe(
        map((res) => {
          if (res.status === 200 || res.status === 201) {
            var data = JSON.parse(res.body);
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
        `nowcerts_extension/nowcerts_field_mappings/fetch_mapping?page_url=${url ? url.split('?')[0] : ''
        }`
      )
      .pipe(
        map((res) => {
          if (res) {
            const result = JSON.parse(res.body);
            this.fieldsMappings = result.field_mapping.fields_mapping;
            chrome.storage.local.set({ fieldsMappings: this.fieldsMappings });
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

  removeReference(input) {
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
      data.nowcerts_field_mapping.fields_mapping[input] = '';
      this.successMessage = 'Successfully UnMapped';
      this.mapAndUnmap(data);
      this.ngOnInit();
    } else {
      this.isShown = true;
    }
  }

  getValueByKey(keyToCheck: string): any {
    if (this.adminMappings && keyToCheck && this.adminMappings.hasOwnProperty(keyToCheck)) {
      return this.adminMappings[keyToCheck];
    } else {
      return '';
    }
  }
  resetData(input) {
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
      data.nowcerts_field_mapping.fields_mapping[input] = this.getValueByKey(input);
      this.successMessage = 'Successfully Reseted';
      this.mapAndUnmap(data);
      this.ngOnInit();
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
              this.isSuccess = false;
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
  handleSelection(event: any, type: string) {
    const selectedValue = event;
    if (type === 'insured') {
      if (this.selectedInsured === selectedValue) {
        this.selectedInsured = '';
      } else {
        this.selectedInsured = selectedValue;
        this.originalFieldName = `insured.${this.insuredList[
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
        this.originalFieldName = `policy.${this.policyList[this.filteredPolicyList.indexOf(this.selectedPolicy)]
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
        this.originalFieldName = `vehicle.${this.vehicleList[
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
        this.originalFieldName = `driver.${this.driverList[this.filteredDriverList.indexOf(this.selectedDriver)]
          }.${this.fieldType}`;
      }
      this.selectedInsured = null;
      this.selectedVehicle = null;
      this.selectedPolicy = null;
    }
  }
}
