import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiAuthResponse, ApiResponseBase } from '@deploy/schemas/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthClientService {

  constructor(private readonly _http: HttpClient) { }

  public signIn(username: string, password: string): Observable<ApiAuthResponse> {
    return this._http.post<ApiAuthResponse>('/api/sign-in', { username, password });
  }

  public keepSessionOpen(): Observable<ApiResponseBase> {
    return this._http.post<ApiResponseBase>('/api/keep-session-open', undefined);
  }

  public logout(): Observable<ApiResponseBase> { 
    return this._http.post<ApiResponseBase>('/api/logout', undefined);
  }
}
