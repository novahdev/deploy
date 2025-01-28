import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '@deploy/panel/common/projects/project.model';
import { ProjectsDataService } from '@deploy/panel/common/projects/projects-data.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { StatusProjectIconComponent } from "../../ui/status-project-icon/status-project-icon.component";

@Component({
  selector: 'app-projects-page',
  imports: [
    NzButtonModule,
    RouterLink,
    NzDropDownModule,
    StatusProjectIconComponent
],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss'
})
export class ProjectsPageComponent {
  private readonly _projectsDataService: ProjectsDataService = inject(ProjectsDataService);
  protected readonly projects = signal<Project[]>([]);
  protected readonly disabledButtons = signal<boolean>(false);

  constructor() {
    this._projectsDataService.getData().then(data => { 
      this.projects.set(data);
    })
  }

  protected onClickRefresh(): void {  
    this.disabledButtons.set(true);
    this._projectsDataService.getData(true)
    .then(data => { 
      this.disabledButtons.set(false);
      this.projects.set(data);
    })
    .catch(() => {
      this.disabledButtons.set(false);
    })
  }
}
