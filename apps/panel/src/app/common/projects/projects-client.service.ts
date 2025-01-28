import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiProjectCreateRequest, ApiProjectResponse, ApiProjectsResponse, ApiProjectUpdateRequest, ApiResponse } from '@deploy/schemas/api';

@Injectable({
  providedIn: 'root'
})
export class ProjectsClientService {

  constructor(private readonly _http: HttpClient) { }

  public getProjects(): Observable<ApiProjectsResponse> {
    return this._http.get<ApiProjectsResponse>('/api/projects');
  }

  public getProject(id: string): Observable<ApiProjectResponse> {
    return this._http.get<ApiProjectResponse>(`/api/projects/${id}`);
  }

  public createProject(data: ApiProjectCreateRequest): Observable<ApiProjectResponse> {
    return this._http.post<ApiProjectResponse>('/api/projects', data);
  }

  public updateProject(id: string, data: ApiProjectUpdateRequest): Observable<ApiProjectResponse> { 
    return this._http.put<ApiProjectResponse>(`/api/projects/${id}`, data);
  }

  public deleteProject(id: string): Observable<ApiResponse> {
    return this._http.delete<ApiResponse>(`/api/projects/${id}`);
  }

  public runProject(id: string): Observable<ApiResponse> {
    return this._http.post<ApiResponse>(`/api/projects/${id}/run`, {});
  }

  public stopProject(id: string): Observable<ApiResponse> {
    return this._http.post<ApiResponse>(`/api/projects/${id}/stop`, {});
  }

  public restartProject(id: string): Observable<ApiResponse> {
    return this._http.post<ApiResponse>(`/api/projects/${id}/restart`, {});
  }
}
