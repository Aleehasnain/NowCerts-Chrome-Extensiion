import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, catchError, finalize } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-mapping-categories',
  templateUrl: './mapping-categories.component.html',
  styleUrls: ['./mapping-categories.component.css']
})
export class MappingCategoriesComponent {
  systemMappinList : any = [
    "google.com",
    "facebook.com",
    "instagram.com",
  ];
  loggedData: any = '';

  fieldsMappings: any;
  systemMapping: any = [];
  agencyMapping: any = [];
  requests:any = [];
  apiError: boolean = false;
  isSuccess: boolean = false;
  apiErrorMessage = 'Bad Request';
  successMessage = '';

  isLoaderShow: boolean = true;


  constructor(private http: HttpService, private utils: UtilsService,
    private router: Router) {}
  ngOnInit(): void{
    this.loggedData = this.utils.getDataFromLocalStorage('loggedData');
    this.getRequestFromServer();
  }
  superAdmin(){

  }
  getRequestFromServer() {
    console.log("Called");
    this.requests = [];
    this.systemMapping = [];
    this.agencyMapping = [];

    let param = this.loggedData?.role !== 'super_admin'? '?with_admin_fields=true' : '';
     this.http
      .getRequest(
        `nowcerts_extension/nowcerts_field_mappings${param}`
      )
      .pipe( finalize(()=>{
        this.isLoaderShow = false;

      })).subscribe((res:any)=>{
        if (res) {
          const result = JSON.parse(res.body);
          if(this.loggedData?.role == 'super_admin'){
            
            result.field_mappings.personal_fields.forEach(element => {
              if(element?.status=='requested'){
                this.requests.push(element)
              }else{
                this.systemMapping.push(element);
              }
            });
          }else{
            this.agencyMapping = result.field_mappings.personal_fields;
            this.systemMapping = result.field_mappings.super_admin_fields
          }
          //this.fieldsMappings = result.field_mappings.personal_fields;
          console.log("Response Result", this.systemMapping)
          chrome.storage.local.set({ fieldsMappings: this.fieldsMappings });
          this.utils.saveDataInLocalStorage(
            'feilsMapping',
            this.fieldsMappings
          );
        }
        return res;
      })
  }
  requestsPage(){
    this.router.navigate(['/dashboard/requests'], { state: this.requests
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
  duplicateAsAgency(field:any){
    const data = {
      nowcerts_field_mapping: {
        domain: field.domain,
        page_url: field.page_url,
        fields_mapping: field.fields_mapping,
      },
    };
    
    this.mapAndUnmap(data);
  }
  deleteItemFromServer(id) {
    this.isLoaderShow = true;
    this.http
      .deleteRequest(`nowcerts_extension/nowcerts_field_mappings/${id}`)
      .pipe(finalize(() => {
        this.isLoaderShow = false;
      }))
      .subscribe(
        (res) => {
          if (res.status === 200 || res.status === 201) {
            this.successMessage = 'Successfully Deleted';
            this.isSuccess = true;
            setTimeout(() => {
              chrome.runtime.sendMessage({ action: 'apiSuccess' });
              this.isSuccess = false;
            }, 3000);
            this.ngOnInit();
          }
        },
        (err) => {
          
        }
      );
  }
  mapAndUnmap(data) {
    this.http
      .postRequest('nowcerts_extension/nowcerts_field_mappings.json', data)
      .subscribe(
        (res) => {
          if (res.status === 200 || res.status === 201) {
            this.successMessage = 'Successfully Duplicated';
            this.isSuccess = true;
            setTimeout(() => {
              chrome.runtime.sendMessage({ action: 'apiSuccess' });
              this.isSuccess = false;
            }, 3000);
            this.ngOnInit();
          }
        },
        (err) => {
          if (err.status === 400 || err.status === 403) {
           // this.responseService.openSnackBar('Bad Request', 'error');
          } else {
            const msg = JSON.parse(err.error);
          //  this.responseService.openSnackBar(msg.message[0], 'error');
          }
        }
      );
  }
}
