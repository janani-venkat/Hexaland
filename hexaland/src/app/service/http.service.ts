import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpClient,
  HttpParams,
} from '@angular/common/http';
import { HEX_CNST } from '../constants/proj.const';
import { isNullOrUndefined } from 'util';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class HttpService implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request);
  }

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  makeGetApiCall(api, url: any, options?: any, params?: any): Observable<any> {
    let endPoint = this.getApiEndPoint(api);
    if (!isNullOrUndefined(endPoint)) {
      endPoint = this.addParamsToURL(options, endPoint);
      let paramsObj = this.addQueryParams(params);
      if (!isNullOrUndefined(url)) {
        return this.http.get(url + endPoint, {
          observe: 'response' as 'body',
          params: paramsObj,
        });
      } else {
        console.error('URL should not be null or undefined ', url);
        return of(null);
      }
    } else {
      console.error('API should not be null or undefined ', api);
      return of(null);
    }
  }

  makePostApiCall(
    api,
    postData,
    url: any,
    options?: any,
    params?: any
  ): Observable<any> {
    let endPoint = this.getApiEndPoint(api);
    if (!isNullOrUndefined(endPoint)) {
      endPoint = this.addParamsToURL(options, endPoint);
      let paramsObj = this.addQueryParams(params);
      if (!isNullOrUndefined(url)) {
        return this.http.post(url + endPoint, postData, {
          observe: 'response' as 'body',
          params: paramsObj,
        });
      } else {
        console.error('URL should not be null or undefined ', url);
        return of(null);
      }
    } else {
      console.error('API should not be null or undefined ', api);
      return of(null);
    }
  }

  /**
   * end of common API
   */

  addQueryParams(data) {
    let params = new HttpParams();
    if (!isNullOrUndefined(data) && typeof data === 'object') {
      for (const param of Object.keys(data)) {
        params = params.set(param, data[param]);
      }
    }
    return params;
  }

  addParamsToURL(options, endPoint) {
    if (!isNullOrUndefined(options) && typeof options !== 'string') {
      const extraParams: string[] = Object.values(options);
      endPoint += '/';
      extraParams.forEach((param, index) => {
        endPoint += param + (index !== extraParams.length - 1 ? '/' : '');
      });
    } else if (typeof options === 'string') {
      endPoint += `/${options}`;
    }
    return endPoint;
  }

  getApiEndPoint(api: any): string | null {
    const apiMapping = HEX_CNST.API_MAPPING;
    if (
      !isNullOrUndefined(api) &&
      !isNullOrUndefined(apiMapping) &&
      !isNullOrUndefined(apiMapping[api])
    ) {
      return apiMapping[api];
    } else {
      return null;
    }
  }

  showToastMessage(message: string, type: string, options?: any): void {
    let toastOptions: any = HEX_CNST.TOASTR_CNST;
    if (!isNullOrUndefined(options)) {
      toastOptions = { ...HEX_CNST.TOASTR_CNST, ...options.options };
    }
    this.toastr.clear();
    this.toastr[type](message, toastOptions.title, toastOptions);
  }
}
