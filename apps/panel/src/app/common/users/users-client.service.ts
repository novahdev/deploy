import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUserCreateResponse, ApiUsersResponse } from '@deploy/schemas/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersClientService {

  constructor(private readonly _http: HttpClient) { }

  public getUsers(): Observable<ApiUsersResponse> {
    return this._http.get<ApiUsersResponse>('api/users');
  }

  public updateUser(id: string, data: { name: string, email: string }): Observable<void> {
    return this._http.put<void>(`api/users/${id}`, data);
  }

  public createUser(data: { name: string, email: string, password: string }): Observable<ApiUserCreateResponse> {
    return this._http.post<ApiUserCreateResponse>('api/users', data);
  }

  public deleteUser(id: string): Observable<void> { 
    return this._http.delete<void>(`api/users/${id}`);
  }
}
