import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiAccessTokensResponse, ApiProfileUpdateBody, ApiResponse } from '@deploy/schemas/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileClientService {

  constructor(private readonly _http: HttpClient) { }

  public getProfile(): Observable<{ data:{ role: "admin" | "collaborator", name: string, email: string } }> {
    return this._http.get<{ data:{ role: "admin" | "collaborator", name: string, email: string } }>("/api/profile");
  }

  public updateProfile(data: ApiProfileUpdateBody): Observable<void> {
    return this._http.put<void>("/api/profile", data);
  }

  public getAccessTokens(): Observable<ApiAccessTokensResponse> {
    return this._http.get<ApiAccessTokensResponse>("/api/profile/access-tokens");
  }

  public deleteAccessToken(id: string): Observable<ApiResponse> {
    return this._http.delete<ApiResponse>(`/api/profile/access-tokens/${id}`);
  }

  public  updatePassword(data: { password: string, newPassword: string }): Observable<ApiResponse> {
    return this._http.put<ApiResponse>("/api/profile/password", data);
  }
}
