import { FetchInputfeildNameService } from './../../services/fetch-inputfeild-name.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Observable, catchError, finalize, map } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { ResponseService } from 'src/app/services/response.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css'],
})
export class ListViewComponent implements OnInit {
  selectedInsured = '';
  selectedPolicy = '';
  finalFetchList = '';
  isDropdownOpen = false;
  insuredList: any[] = [];
  isDropdownOpenTwo = false;
  isDropdownOpenThree = false;
  isDropdownOpenFour = false;
  isDiv = false;
  isPolicy = false;
  isVehicle = false;
  isDriver = false;
  apiError = false;
  keywordVehicle = 'vehicle';
  keywordInsured = 'general';
  keywordDriver = 'driver';
  apiErrorMessage = '';
  insuredsearchKeyword: string = '';
  policysearchKeyword: string = '';
  vehiclesearchKeyword: string = '';
  driversearchKeyword: string = '';
  policiesList: any[] = [];
  fieldMappings: any;
  isLoaderShow = true;
  activeUrl: string;
  vehiclesList: any[] = [];
  selectedVehicle: '';
  selectedInsuredData: any;
  selectedVehicleData: any;
  selectedPolicyData: any;
  isButtonShown = false;
  driversList: any[] = [];
  selectedDriver: '';
  selectedDrvierData: any = '';
  hasVehicle = false;
  hasDriver = false;
  isSimpleFlow: any;
  isClearinsured: boolean = true;
  isClearpolicy: boolean = true;

  isClearvehicle: boolean = true;
  isCleardriver: boolean = true;
  originalStoreInsureData: any[];
  originalStorePolicyData: any[];
  filteredPoliciesList: any[];
  isSearchingPolicy: boolean = false;
  isSearchingVehicle: boolean = false;
  isSearchingDriver: boolean = false;
  originalStoreVehcileData: any[];
  originalStoreDriverData: any[];

  constructor(
    private http: HttpService,
    private datePipe: DatePipe,
    private renderer: Renderer2,
    private responseService: ResponseService,
    private utils: UtilsService,
    private fetchdata: FetchInputfeildNameService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCurrentUrl().then((url) => {
      this.activeUrl = url;
      this.setFormData();
    });
  }
  handleSearchInsured() {
    if (this.insuredsearchKeyword) {
      this.isClearinsured = false;
    } else {
      this.isClearinsured = true;
    }

    console.log('BeforeinsuredList', this.insuredList);

    if (this.insuredsearchKeyword) {
      const filteredList = this.insuredList.filter((item) =>
        item.commercialName
          .toLowerCase()
          .includes(this.insuredsearchKeyword.toLowerCase())
      );
      this.insuredList = filteredList;
    } else {
      this.restoreOriginalInsuredList(); // Restore the original array
    }

    console.log('AfterinsuredList', this.insuredList);
  }

  restoreOriginalInsuredList() {
    this.insuredList = this.originalStoreInsureData;
  }

  clearSearchinsured() {
    this.insuredsearchKeyword = '';
    this.restoreOriginalInsuredList(); // Restore the original array
  }
  handleSearchPolicy() {
    if (this.policysearchKeyword) {
      this.isClearpolicy = false;
      const filteredList = this.policiesList.filter((item) =>
        item.name.toLowerCase().includes(this.policysearchKeyword.toLowerCase())
      );
      this.policiesList = filteredList;
      this.isSearchingPolicy = true;
    } else {
      this.isClearpolicy = true;
      this.isSearchingPolicy = false;
      this.restoreOriginalPolicyList(); // Restore the original array
    }
  }

  restoreOriginalPolicyList() {
    this.isSearchingPolicy = false;
    this.policiesList = this.originalStorePolicyData;
  }

  clearSearchpolicy() {
    this.policysearchKeyword = '';
    this.restoreOriginalPolicyList(); // Restore the original array
  }

  handleSearchVehicle() {
    if (this.vehiclesearchKeyword) {
      this.isClearvehicle = false;
      const filteredList = this.vehiclesList.filter((item) =>
        item.name
          .toLowerCase()
          .includes(this.vehiclesearchKeyword.toLowerCase())
      );
      this.vehiclesList = filteredList;
      this.isSearchingVehicle = true;
    } else {
      this.isClearvehicle = true;
      this.isSearchingVehicle = false;
      this.restoreOriginalVehicleList(); // Restore the original array
    }
  }

  restoreOriginalVehicleList() {
    this.isSearchingVehicle = false;
    this.vehiclesList = this.originalStoreVehcileData;
  }

  clearSearchVehicle() {
    this.vehiclesearchKeyword = '';
    this.restoreOriginalVehicleList(); // Restore the original array
  }

  handleSearchDriver() {
    if (this.driversearchKeyword) {
      this.isCleardriver = false;
      const filteredList = this.driversList.filter((item) =>
        item.name.toLowerCase().includes(this.driversearchKeyword.toLowerCase())
      );
      this.driversList = filteredList;
      this.isSearchingDriver = true;
    } else {
      this.isCleardriver = true;
      this.isSearchingDriver = false;
      this.restoreOriginalDriverList(); // Restore the original array
    }
  }

  restoreOriginalDriverList() {
    this.isSearchingDriver = false;
    this.driversList = this.originalStoreDriverData;
  }

  clearSearchDriver() {
    this.driversearchKeyword = '';
    this.restoreOriginalDriverList(); // Restore the original array
  }
  async setFormData() {
    if (this.activeUrl) {
      this.isSimpleFlow =
        await this.fetchdata.getSimpleFlowBooleanFromStorage();
      this.getInsuredListFromServer();
      this.getRequestFromServer(this.activeUrl);
      // this.fieldMappings = this.utils.getDataFromLocalStorage('feilsMapping');

      if (this.isSimpleFlow) {
        this.isButtonShown = false;
        chrome.storage.local.set({ visitUrl: this.activeUrl });
      } else {
        console.log('one');
      }
    }
  }

  getRequestFromServer(url) {
    this.http
      .getRequest(
        `nowcerts_extension/nowcerts_field_mappings/fetch_mapping?page_url=${
          url.split('?')[0]
        }`
      )
      .subscribe((res) => {
        if (res) {
          const result = JSON.parse(res.body);
          const { field_mapping } = result;
          this.fieldMappings = field_mapping?.fields_mapping;
          console.log(this.fieldMappings, 'this.fieldMappings');
        }
      });
  }

  onChange(event: any) {
    this.postPoliciesListFromServer(event.value);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.isDiv = !this.isDiv;
  }
  goBack() {
    chrome.storage.local.set({ isSimpleFlow: true });
    chrome.storage.local.set({ visitUrl: '' });
    localStorage.removeItem('domain');
    this.router.navigate(['/dashboard']);
  }
  handleSelection(event: any, type: string) {
    switch (type) {
      case 'insured':
        if (event.value === this.selectedInsured) {
          this.selectedInsured = ''; // Uncheck the selected vehicle if it's already selected
          this.policiesList = [];
          this.isButtonShown = false;
        } else {
          this.selectedInsured = event.value;
          this.selectedInsuredData = this.getSelectedInsuredData(
            this.selectedInsured
          );
          this.postPoliciesListFromServer(this.selectedInsured);
        }
        this.selectedPolicy = '';
        this.vehiclesList = [];
        this.driversList = [];
        this.isButtonShown = !!(this.insuredList && this.selectedInsured);
        chrome.storage.local.set({ selectedInsured: this.selectedInsured });
        break;

      case 'policy':
        if (event.value === this.selectedPolicy) {
          this.selectedPolicy = ''; // Uncheck the selected vehicle if it's already selected
          this.vehiclesList = [];
          this.driversList = [];
          this.isButtonShown = false;
        } else {
          this.selectedPolicy = event.value;
          this.selectedPolicyData = this.getSelectedPolicyData(
            this.selectedPolicy
          );
          if (this.selectedPolicy) {
            this.postPolicyVehicles(this.selectedPolicy);
          }
          if (this.selectedPolicy) {
            this.postPolicyDrivers(this.selectedPolicy);
          }
        }
        this.selectedVehicle = '';
        this.selectedDriver = '';
        this.isButtonShown = !!(this.policiesList && this.selectedPolicy);
        chrome.storage.local.set({ selectedPolicy: this.selectedPolicy });
        break;

      case 'vehicle':
        if (event.value === this.selectedVehicle) {
          this.selectedVehicle = ''; // Uncheck the selected vehicle if it's already selected
        } else {
          this.selectedVehicle = event.value;
          this.selectedVehicleData = this.getSelectedVehicleData(
            this.selectedVehicle
          );
        }
        chrome.storage.local.set({ selectedVehicle: this.selectedVehicle });
        break;

      case 'driver':
        if (event.value === this.selectedDriver) {
          this.selectedDriver = ''; // Uncheck the selected vehicle if it's already selected
        } else {
          this.selectedDriver = event.value;
          this.selectedDrvierData = this.getSelectedDriverData(
            this.selectedDriver
          );
        }
        chrome.storage.local.set({ selectedDriver: this.selectedDriver });
        break;

      default:
        break;
    }
  }

  getSelectedVehicleData(vehicleId: string) {
    return this.vehiclesList.find((vehicleObj) => vehicleObj.id === vehicleId);
  }

  getSelectedInsuredData(insuredId: string) {
    return this.insuredList.find((insuredObj) => insuredObj.id === insuredId);
  }
  getSelectedDriverData(driverId: string) {
    return this.driversList.find((driverObj) => driverObj.id === driverId);
  }

  getSelectedPolicyData(policyId: string) {
    return this.policiesList.find((policyObj) => policyObj.id === policyId);
  }

  private postPolicyVehicles(id: any) {
    this.isLoaderShow = true;
    this.http
      .postRequest('Policy/PolicyVehicles', { PolicyDataBaseId: [id] })
      .pipe(finalize(() => (this.isLoaderShow = false)))
      .subscribe(
        (e) => {
          const data: any[] = JSON.parse(e.body);
          this.vehiclesList = data.map((e) => ({
            ...e,
            id: e.databaseId,
            name:
              e?.make && e?.type
                ? `${e.type} - ${e.make}${e.vin ? ' - ' + e.vin : ''}`
                : '',
          }));
          this.originalStoreVehcileData = this.vehiclesList;
          if (!this.isSimpleFlow) {
            this.fetchdata.getVehicleDataFromStorage().then((data) => {
              this.selectedVehicle = data;
              this.selectedVehicleData = this.getSelectedVehicleData(
                this.selectedVehicle
              );
            });
          }
        },
        (error) => {
          this.handleApiError(error);
        }
      );
  }
  private postPolicyDrivers(id: any) {
    this.isLoaderShow = true;
    this.http
      .postRequest('Policy/PolicyDrivers', { PolicyDataBaseId: [id] })
      .pipe(finalize(() => (this.isLoaderShow = false)))
      .subscribe(
        (e) => {
          const data: any[] = JSON.parse(e.body);
          this.driversList = data.map((e) => ({
            ...e,
            id: e.databaseId,
            name:
              e?.firstName && e?.lastName
                ? `${e.firstName} - ${e.lastName}`
                : '',
          }));
          this.originalStoreDriverData = this.driversList;
          if (!this.isSimpleFlow) {
            this.fetchdata.getDriverDataFromStorage().then((data) => {
              this.selectedDriver = data;
              this.selectedDrvierData = this.getSelectedDriverData(
                this.selectedDriver
              );
            });
          }
        },
        (error) => {
          this.handleApiError(error);
        }
      );
  }

  toggleDropdownTwo() {
    this.isDropdownOpenTwo = !this.isDropdownOpenTwo;
    this.isPolicy = !this.isPolicy;
  }

  toggleDropdownThree() {
    this.isDropdownOpenThree = !this.isDropdownOpenThree;
    this.isVehicle = !this.isVehicle;
  }
  toggleDropdownFour() {
    this.isDropdownOpenFour = !this.isDropdownOpenFour;
    this.isDriver = !this.isDriver;
  }

  onClickFillInformation() {
    console.log('1');

    if (this.selectedInsured) {
      // console.log('2');
      console.log('Selected Insured', this.selectedInsuredData);
      console.log('Selectd Policy', this.selectedPolicyData);
      console.log('Selected Vehicle', this.selectedVehicleData);
      console.log('Selected Driver', this.selectedDrvierData);
      const config = {
        selectedInsured: this.selectedInsuredData
          ? this.selectedInsuredData
          : '',
        selectedVehicle: this.selectedVehicleData
          ? this.selectedVehicleData
          : '',
        selectedDriver: this.selectedDrvierData ? this.selectedDrvierData : '',
        selectedPolicy: this.selectedPolicyData ? this.selectedPolicyData : '',
        fieldMappings: (this.fieldMappings as Array<any>)
          ? (this.fieldMappings as Array<any>)
          : '',
      };
      console.log('Before', config);
      chrome.tabs.executeScript(
        {
          code: 'var data = ' + JSON.stringify(config),
        },
        function () {
          chrome.tabs.executeScript({
            file: 'fillPolicyForm.js',
          });
        }
      );
    }
  }

  getCurrentUrl(): Promise<any> {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentUrl = tabs[0].url;
        resolve(currentUrl);
      });
    });
  }

  private getInsuredListFromServer() {
    this.http
      .getRequest(
        `InsuredDetailList()?$count=${true}&$orderby=${'type asc'}&$skip=${0}&$top=${10000}`
      )
      .pipe(finalize(() => (this.isLoaderShow = false)))
      .subscribe(
        (e) => {
          const { value } = JSON.parse(e.body);

          this.insuredList = value || [];
          this.originalStoreInsureData = this.insuredList;
          if (!this.isSimpleFlow) {
            this.fetchdata.getInsuredDataFromStorage().then((data) => {
              this.selectedInsured = data;
              this.selectedInsuredData = this.getSelectedInsuredData(
                this.selectedInsured
              );
              if (this.selectedInsured)
                this.postPoliciesListFromServer(this.selectedInsured);
            });
          }
        },
        (error) => {
          this.handleApiError(error);
        }
      );
  }

  private postPoliciesListFromServer(id: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.isLoaderShow = true;
      this.http
        .postRequest('Insured/InsuredPolicies', { InsuredDataBaseId: [id] })
        .pipe(finalize(() => (this.isLoaderShow = false)))
        .subscribe(
          (e) => {
            var data: any[] = JSON.parse(e.body);
            data = data.filter((obj) => !obj.isQuote);
            this.policiesList =
              data.map((e) => ({
                ...e,
                id: e.databaseId,
                name: e?.number
                  ? `${e?.number} (${this.datePipe.transform(
                      e?.effectiveDate,
                      'MM-dd-yyyy'
                    )} ${e?.linesOfBusiness[0]})`
                  : '',
              })) || [];
            if (!this.isSimpleFlow) {
              this.executePolicyData();
            }
            this.originalStorePolicyData = this.policiesList;
            resolve(); // Resolve the promise after processing the response
          },
          (error) => {
            this.handleApiError(error);
            reject(error); // Reject the promise if there's an error
          }
        );
    });
  }

  async executePolicyData() {
    if (this.policiesList.length) {
      console.log('threee');
      const policydata = await this.fetchdata.getPolicyDataFromStorage();
      this.selectedPolicy = policydata;
      this.isButtonShown = !!(this.insuredList && this.selectedInsured);
      if (this.selectedPolicy) {
        this.selectedPolicyData = this.getSelectedPolicyData(
          this.selectedPolicy
        );
        if (this.selectedPolicy) {
          this.postPolicyVehicles(this.selectedPolicy);
        }
        if (this.selectedPolicy) {
          this.postPolicyDrivers(this.selectedPolicy);
        }
      }
    }
  }

  private handleApiError(error: any) {
    this.apiError = true;
    if (error.status === 400) {
      this.policiesList = [];
      this.apiErrorMessage = 'Bad Request';
    } else {
      this.apiErrorMessage = 'An error occurred. Please try again later.';
    }
  }
}
