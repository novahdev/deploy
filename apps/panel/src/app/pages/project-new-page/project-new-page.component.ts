import { Component, inject, viewChild } from '@angular/core';
import { ProjectFormComponent } from "../../ui/project-form/project-form.component";
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProjectsClientService } from '@deploy/panel/common/projects/projects-client.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Project } from '@deploy/panel/common/projects/project.model';
import { ProjectsDataService } from '@deploy/panel/common/projects/projects-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-new-page',
  imports: [
    ProjectFormComponent,
    NzButtonModule
  ],
  templateUrl: './project-new-page.component.html',
  styleUrl: './project-new-page.component.scss'
})
export class ProjectNewPageComponent {
  private readonly _nzMessageService: NzMessageService = inject(NzMessageService);
  private readonly _projectService: ProjectsClientService = inject(ProjectsClientService);
  private readonly _projectsDataService: ProjectsDataService = inject(ProjectsDataService);
  private readonly _router: Router = inject(Router);

  protected form = viewChild(ProjectFormComponent);

  protected onClickSave(): void { 
    const form = this.form();
    if (form){
      if (form.invalid){
        this._nzMessageService.warning("Falta campos por completar.");
        return;
      }
      const values = form.getRawValue();
      form.disable();
      this._projectService.createProject({
        domain: values.domain,
        name: values.name,
        process_name: values.processName,
        location: values.location,
        startup_file: values.startupFile,
        framework: values.framework ?? undefined,
        running_on: values.runningOn ?? undefined,
        runtime_environment: values.runtimeEnvironment ?? undefined,
        env: values.env,
        ignore: values.ignore ?? [],
      }).subscribe({
        next: res => {
          const project = new Project(res.data);
          this._projectsDataService.push(project);
          this._nzMessageService.success("Proyecto creado con éxito.");
          this._router.navigate(["/projects", project.id]);
          form.enable();
        },
        error: (error: HttpErrorResponse) => {
          form.enable();
          this._nzMessageService.error(error.error.message ?? "Error al crear el proyecto.");
        }
      });
    }
  }
}
