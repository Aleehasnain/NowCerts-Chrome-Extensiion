import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { Page404Component } from './page404/page404.component';
import { LoginComponent } from './auth/login/login.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
// import { TokenInterceptor } from 'src/app/services/interceptor/token.interceptor';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';

import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TokenInterceptor } from './services/interceptor/token.interceptor';
import { JwtService } from './services/jwt/jwt.service';
import { DatePipe } from '@angular/common';
import { FetchInputfeildNameService } from './services/fetch-inputfeild-name.service';
import { PopupguardGuard } from './guards/popupguard.guard';
import { RecheckedGuard } from './guards/rechecked.guard';

@NgModule({
  declarations: [AppComponent, Page404Component, LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatExpansionModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    MatExpansionModule,
    MatListModule,
    NgxDaterangepickerMd.forRoot(),
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2000 } },
    {
      provide: MatDialogRef,
      useValue: {
        close: (dialogResult: any) => {},
      },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    JwtService,
    DatePipe,
    FetchInputfeildNameService,
    PopupguardGuard,
    RecheckedGuard
  ],
  bootstrap: [AppComponent],
  exports: [Page404Component, LoginComponent],
})
export class AppModule {}
