# Practice with fireBase

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.5.

## Installation Command

npm i firebase @angular/fire

### Set Environment

firebaseConfig: {
apiKey: '---------------',
authDomain: '--------------',
projectId: '------------',
storageBucket: '---------',
messagingSenderId: '-----------',
appId: '------------------',
measurementId: '-------------',
},

### Set App Module

import { AngularFirestoreModule } from '@angular/fire/compat/firestore/';
import { AngularFireModule } from '@angular/fire/compat';

AngularFirestoreModule,
AngularFireModule.initializeApp(environment.firebaseConfig),

## Check Student Service

Student crud is available in Student Service.Ts.😊

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
#   a n g u l a r _ f i r e b a s e  
 #   n o w c e r t s - c h r o m e - e x t  
 