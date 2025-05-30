// import { JwtService } from './../../../services/jwt/jwt.service';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { ResponseService } from 'src/app/services/response.service';
import * as jwt_encode from 'jwt-encode';
import { JwtService } from 'src/app/services/jwt/jwt.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
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
  selector: 'app-add-mapping',
  templateUrl: './add-mapping.component.html',
  styleUrls: ['./add-mapping.component.css'],
})
export class AddMappingComponent implements OnInit {
  image = null;
  userId = null;
  activeUrl;
  addNewForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      // Validators.minLength(4),
      // Validators.maxLength(8),
      // Validators.pattern('[a-zA-Z ]*'),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      // Validators.minLength(4),
      // Validators.maxLength(7),
      // Validators.pattern('[a-zA-Z ]*'),
    ]),
    title: new FormControl('', [
      Validators.required,
      // Validators.minLength(4),
      // Validators.maxLength(7),
      // Validators.pattern('[a-zA-Z ]*'),
    ]),
    email: new FormControl('', [Validators.required]),

    city: new FormControl('', [
      Validators.required,
      // Validators.minLength(4),
      // Validators.pattern('[a-zA-Z ]*'),
    ]),
    phone: new FormControl('', [
      Validators.required,
      // Validators.minLength(4),
      // Validators.maxLength(11),
      // Validators.pattern('[0-9 ]+'),
    ]),
    state: new FormControl('', [
      Validators.required,
      // Validators.minLength(4),
      // Validators.pattern('[a-zA-Z ]*'),
    ]),
    region: new FormControl('', [
      Validators.required,
      // Validators.minLength(4),
      // Validators.pattern('[a-zA-Z ]*'),
    ]),

    street: new FormControl('', [
      Validators.required,
      // Validators.minLength(4),
      // Validators.pattern('[a-zA-Z ]*'),
    ]),

    zipcode: new FormControl('', [
      Validators.required,
      // Validators.minLength(4),
      // Validators.pattern('[a-zA-Z ]*'),
    ]),
    fax: new FormControl('', [
      Validators.required,
      // Validators.minLength(4),
      // Validators.pattern('[a-zA-Z ]*'),
    ]),
    description: new FormControl('', [
      Validators.required,
      // Validators.minLength(4),
      // Validators.pattern('[a-zA-Z ]*'),
    ]),
  });

  matcher = new MyErrorStateMatcher();
  isFormSubmitted = false;
  constructor(
    private responseService: ResponseService,
    private router: Router,
    private http: HttpService,
    private JwtService: JwtService
  ) {}

  ngOnInit(): void {
    // this.setFormData('');
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      this.activeUrl = tabs[0].url;
      // var data = Array.from(document.getElementsByTagName('input'))
      // document.querySelector
    });
  }

  onsubmit() {
    if (this.addNewForm.valid) {
      let body: any = {
        nowcerts_field_mapping: {
          domain: 'nowcerts.com',
          page_url: this.activeUrl,
          fields_mapping: {
            fax: this.addNewForm.value.fax,
            city: this.addNewForm.value.city,
            email: this.addNewForm.value.email,
            phone: this.addNewForm.value.phone,
            state: this.addNewForm.value.state,
            title: this.addNewForm.value.title,
            region: this.addNewForm.value.region,
            street: this.addNewForm.value.street,
            zipcode: this.addNewForm.value.zipcode,
            lastname: this.addNewForm.value.lastName,
            firstname: this.addNewForm.value.firstName,
            contacted: 'Sales Qualified',
            undefined: 'middleName',
            salutation: 'salutation',
            description: this.addNewForm.value.description,
            lead_source: 'lead_source',
            not_contacted: 'Marketing Qualified1',
          },
        },
      };

      this.saveBuilderToServer(body);
    } else {
      this.responseService.openSnackBar(
        'Please enter valid data in order to create a new Builder.',
        'error'
      );
    }
  }

  saveBuilderToServer(formData) {
    this.http
      .postRequest(
        'api/nowcerts_extension/nowcerts_field_mappings.json',
        formData
      )
      .pipe(finalize(() => {}))
      .subscribe(
        (res) => {
          if (res.status === 200 || res.status === 201) {
            this.router.navigate(['dashboard/mapping']);
          }
        },
        (err) => {
          if (err.status === 400 || err.status === 403) {
            this.responseService.openSnackBar('Bad Request', 'error');
          } else {
            this.responseService.openSnackBar(
              'Page url has already been taken',
              'error'
            );
          }
        }
      );
  }

  setFormData(data) {
    this.addNewForm.controls['fax'].setValue(data.fax);
    this.addNewForm.controls['city'].setValue(data.city);
    this.addNewForm.controls['email'].setValue(data.email);
    this.addNewForm.controls['phone'].setValue(data.phone);
    this.addNewForm.controls['state'].setValue(data.state);
    this.addNewForm.controls['title'].setValue(data.title);
    this.addNewForm.controls['region'].setValue(data.region);
    this.addNewForm.controls['street'].setValue(data.street);
    this.addNewForm.controls['zipcode'].setValue(data.zipcode);
    this.addNewForm.controls['lastname'].setValue(data.lastname);
    this.addNewForm.controls['firstname'].setValue(data.firstname);
    this.addNewForm.controls['contacted'].setValue(data.contacted);
    this.addNewForm.controls['description'].setValue(data.description);
  }

  updateDataFromServer(data, id) {
    this.http
      .putRequest(`api/nowcerts_extension/nowcerts_field_mappings/${id}`, data)
      .pipe(finalize(() => {}))
      .subscribe(
        (res) => {
          if (res.status === 200 || res.status === 201) {
            this.router.navigate(['mapping']);
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
}
