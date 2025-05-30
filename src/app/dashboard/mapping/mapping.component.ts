import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';
import { ResponseService } from 'src/app/services/response.service';
// import { json } from 'stream/consumers';

export interface PeriodicElement {
  name: string;
  position: number;
  id: number;
}

var ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css'],
})
export class MappingComponent {
  activeUrl;
  displayedColumns: string[] = ['position', 'name', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  constructor(
    private http: HttpService,
    private responseService: ResponseService
  ) {
    this.dataSource.data = ELEMENT_DATA;
  }
  ngOnInit(): void {
    this.getRequestFromServer();
  }
  onclickDeleteItem(item) {
    this.deleteItemFromServer(item.id);
  }
  getRequestFromServer() {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      this.activeUrl = tabs[0].url;
      this.http
        .getRequest(
          `api/nowcerts_extension/nowcerts_field_mappings/fetch_mapping?page_url=${this.activeUrl}`
        )
        .pipe(finalize(() => {}))
        .subscribe(
          (res) => {
            if (res.status === 200 || res.status === 201) {
              var data = JSON.parse(res.body);

              ELEMENT_DATA = [
                {
                  position: 1,
                  name: 'Mapping Available',
                  id: data.field_mapping.id,
                },
              ];
              this.dataSource.data = ELEMENT_DATA;
            }
          },
          (err) => {
            if (err.status === 400 || err.status === 404) {
              this.responseService.openSnackBar('Bad Request', 'error');
            } else {
              this.responseService.openSnackBar('System Error', 'error');
            }
          }
        );
    });
  }

  deleteItemFromServer(id) {
    this.http
      .deleteRequest(`api/nowcerts_extension/nowcerts_field_mappings/${id}`)
      .pipe(finalize(() => {}))
      .subscribe(
        (res) => {
          if (res.status === 200 || res.status === 201) {
            this.responseService.openSnackBar(
              'Field mapping has been deleted successfully.',
              'success'
            );
            ELEMENT_DATA = [];
            this.dataSource.data = ELEMENT_DATA;
          }
        },
        (err) => {
          if (err.status === 400 || err.status === 404) {
            this.responseService.openSnackBar('err.message', 'error');
          } else {
            this.responseService.openSnackBar('System Error', 'error');
          }
        }
      );
  }
}
