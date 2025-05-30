import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ResponseService {
  constructor(private snackBar: MatSnackBar) {}
  openSnackBar(message, type, callbackFunction?) {
    let snackBarRef = this.snackBar.open(message, 'x', {
      panelClass: [`${type}-snackbar`],
    });
    if (type == 'success' && callbackFunction != null) {
      snackBarRef.afterDismissed().subscribe(() => {
        callbackFunction();
      });
    }
  }
}
