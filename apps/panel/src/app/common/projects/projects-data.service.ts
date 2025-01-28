import { inject, Injectable } from '@angular/core';
import { Project } from './project.model';
import { ProjectsClientService } from './projects-client.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsDataService {
  private readonly _projectsClientService: ProjectsClientService = inject(ProjectsClientService);
  
  private _data: Project[] = [];

  public getData(refresh?: boolean): Promise<Project[]>{
    return new Promise((resolve, reject) => {
      if (refresh || this._data.length === 0){
        this._projectsClientService.getProjects().subscribe({
          next: res => {
            this._data = res.data.map(item => new Project(item));
            resolve(this._data.slice());
          },
          error: reject
        });
        return;
      }

      resolve(this._data.slice());
    });
  }
  
  public get(id: string): Promise<Project | undefined>{
    return new Promise((resolve, reject) => {
      if (this._data.length === 0){
        this._projectsClientService.getProjects().subscribe({
          next: res => {
            this._data = res.data.map(item => new Project(item));
            const project = this._data.find(item => item.id === id);
            resolve(project);
          },
          error: reject
        });
        return;
      }

      const project = this._data.find(item => item.id === id);
      resolve(project);
    })
  }

  public push(project: Project){
    this._data.push(project);
  }

  public delete(id: string): void{
    const index = this._data.findIndex(item => item.id === id);
    if (index > -1){
      this._data.splice(index, 1);
    }
  }
}
