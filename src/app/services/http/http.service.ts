import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { JwtService } from '../jwt/jwt.service';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient, private Injector: Injector) {}

  serverUrl = environment.baseURL;

  postDataWithSearchPagination(url, data) {
    return this.http.post(url, data) as Observable<HttpResponse<any>>;
  }

  postDataWithBaseURL(api, data) {
    return this.http.post(this.serverUrl + api, data, {
      observe: 'response',
    }) as Observable<HttpResponse<any>>;
  }
  postRequest(api, data?): Observable<HttpResponse<any>> {
    let jwtService = this.Injector.get(JwtService);
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer token ${jwtService.encodeData()}`
    );
    if (
      api.includes('nowcerts_extension/nowcerts_field_mappings')||
      api.includes('nowcerts_extension/nc_ext_whitelisted_domains')
      ) {
      return this.http.post('https://dev.api.20miles.us/api/' + api, data, {
        observe: 'response',
        headers: headers,
        responseType: 'text',
      }) as Observable<HttpResponse<any>>;
    } else {
      return this.http.post(this.serverUrl + api, data, {
        observe: 'response',
        headers: headers,
        responseType: 'text',
      }) as Observable<HttpResponse<any>>;
    }
  }

  putRequest(api, data) {
    let jwtService = this.Injector.get(JwtService);
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer token ${jwtService.encodeData()}`
    );
    if (
      api.includes('nowcerts_extension/nowcerts_field_mappings')
      ) {
      return this.http.put('https://dev.api.20miles.us/api/' + api, data, {
        observe: 'response',
        headers: headers,
        responseType: 'text',
      }) as Observable<HttpResponse<any>>;
    } else {
      return this.http.get(this.serverUrl + api, {
        observe: 'response',
        headers: headers,
        responseType: 'text',
      }) as Observable<HttpResponse<any>>;
    }
  }

  getRequest(api): Observable<HttpResponse<any>> {
    let jwtService = this.Injector.get(JwtService);
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer token ${jwtService.encodeData()}`
    );
    if (
      api.includes('nowcerts_extension/nowcerts_field_mappings') ||
      api.includes('nowcerts_extension/nc_ext_whitelisted_domains')
    ) {
      return this.http.get('https://dev.api.20miles.us/api/' + api, {
        observe: 'response',
        headers: headers,
        responseType: 'text',
      }) as Observable<HttpResponse<any>>;
    } else {
      return this.http.get(this.serverUrl + api, {
        observe: 'response',
        headers: headers,
        responseType: 'text',
      }) as Observable<HttpResponse<any>>;
    }
  }

  deleteRequest(api): Observable<HttpResponse<any>> {
    let jwtService = this.Injector.get(JwtService);
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer token ${jwtService.encodeData()}`
    );
    if (
      api.includes('nowcerts_extension/nowcerts_field_mappings') ||
      api.includes('nowcerts_extension/nc_ext_whitelisted_domains')
    ) {
      return this.http.delete('https://dev.api.20miles.us/api/' + api, {
        observe: 'response',
         headers: headers,
        responseType: 'text',
      }) as Observable<HttpResponse<any>>;
      
    } else {
      return this.http.delete(this.serverUrl + api, {
        observe: 'response',
        // headers: headers,
        responseType: 'text',
      }) as Observable<HttpResponse<any>>;
    }
  }
}
