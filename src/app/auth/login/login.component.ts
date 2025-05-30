import { AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit ,Injector,ViewChild, ElementRef,ViewEncapsulation } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ResponseService } from 'src/app/services/response.service';
import { HttpService } from 'src/app/services/http/http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { UtilsService } from 'src/app/services/utils.service';
import { JwtService } from 'src/app/services/jwt/jwt.service';

export class MyErrorStateMatcher implements ErrorStateMatcher{
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent{
  hide: boolean = true;
  isFormSubmitted = false;
  apiError: boolean=false;



  loading: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });


  matcher = new MyErrorStateMatcher();
  panelOpenState = false;
  apiErrorMessage: string;
  isLoaderShow: boolean=false;

  constructor(
    private router: Router,
    private responseService: ResponseService,
    private http: HttpService,
    private utils: UtilsService,
    private Injector: Injector,
    private jwtService: JwtService

  ) {
    localStorage.clear();

  }


  onSubmit() {
    // this.router.navigate(['/dashboard']);
    this.isFormSubmitted = true;
    if (this.loginForm.valid) {
      this.loading = true;
      this.isLoaderShow=true;
      // const credentials = {
      //   grant_type: 'password',
      //   username: encodeURIComponent(this.loginForm?.value?.email!),
      //   password: encodeURIComponent(this.loginForm.value.password!),
      //   client_id: 'ngAuthApp'
      // };
            var raw = `grant_type=password&username=${encodeURIComponent(this.loginForm.value.email!)}&password=${encodeURIComponent(this.loginForm.value.password!)}&client_id=ngAuthApp`;
      this.http
        .postRequest('token', raw)
        .pipe(
          finalize(() => {
            this.loading = false;
            this.isLoaderShow=false;
          })
        )
        .subscribe(
          (response) => {
            if (response.status === 200 || response.status === 201) {
              var res = JSON.parse(response.body);
              this.jwtService.setUserEmail(res.email);
              this.setDataIntoLocalStorage(res);
              var storeToken = {
                access_token: res.access_token,
                refresh_token: res.refresh_token,
              };
              chrome.storage.local.set({ token: storeToken });
              this.router.navigate(['/dashboard']);
            } else if (response.ok == false) {
              this.apiError=true;
              this.apiErrorMessage='The user name or password is incorrect';
              // this.responseService.openSnackBar(
              //   `The user name or password is incorrect.`,
              //   'error'
              // );
            }

          },
          (error: HttpErrorResponse) => {
            this.apiError=true;

            if (error.error) {
              this.apiErrorMessage='The user name or password is incorrect';
              // this.responseService.openSnackBar(
              //   `The user name or password is incorrect.`,
              //   'error'
              // );
            } else {
              this.apiErrorMessage=`${error.statusText}`;
              // this.responseService.openSnackBar(`${error.statusText}`, 'error');
            }
          }
        );
    } else {
      this.apiError=true;
      this.apiErrorMessage='Please enter valid data';
      // this.responseService.openSnackBar('Please enter valid data ', 'error');
    }
  }

  private setDataIntoLocalStorage(response) {
    this.utils.saveDataInLocalStorage(
      'token',
      response ? response.access_token : null
    );
    // this.utils.saveDataInLocalStorage(
    //   'loggedData',
    //  {email: response ?'khuram.hussain+1@20miles.us' : null,
    //   agency_id: response? response.agencyId: null,
    //   role: response.isAgencyOwner ? 'staff': 'admin'
    // }
    // );
    this.utils.saveDataInLocalStorage(
      'loggedData',
     {email: response ?response.email : null,
      agency_id: response? response.agencyId: null,
      role: this.isSuperAdmin(response.email)? 'super_admin': response.isAgencyOwner=== "true" ? 'admin': 'staff'
    }
    );
  }

  isSuperAdmin(email: string): boolean {
    const expectedDomain = 'fusion.com';
    const domain = email.split('@')[1];
    return domain === expectedDomain;
  }
  getButtonStatus() {
    if (this.isFormSubmitted) {
      return this.loginForm.valid ? 'primary' : 'warn';
    } else {
      return 'primary';
    }
  }
}
