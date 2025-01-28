import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '@deploy/panel/common/projects/project.model';
import { ProjectsClientService } from '@deploy/panel/common/projects/projects-client.service';
import { ProjectsDataService } from '@deploy/panel/common/projects/projects-data.service';
import { ProjectFormComponent } from '@deploy/panel/ui/project-form/project-form.component';
import { ProjectsUsersWithAccessComponent } from '@deploy/panel/ui/projects-users-with-access/projects-users-with-access.component';
import { StatusProjectIconComponent } from '@deploy/panel/ui/status-project-icon/status-project-icon.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';


@Component({
  selector: 'app-project-page',
  imports: [
    NzButtonModule,
    NzModalModule,
    NzDropDownModule,
    StatusProjectIconComponent,
    ProjectFormComponent,
    ProjectsUsersWithAccessComponent,
  ],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss'
})
export class ProjectPageComponent {
  private readonly _nzMessageService: NzMessageService = inject(NzMessageService);
  private readonly _nzModalService: NzModalService = inject(NzModalService);
  private readonly _projectsDataService: ProjectsDataService = inject(ProjectsDataService);
  private readonly _projectsClientService: ProjectsClientService = inject(ProjectsClientService);
  private readonly _router: Router = inject(Router);
  protected readonly projectId = input<string>();
  
  protected project = signal<Project | undefined>(undefined);
  protected editMode = signal<boolean>(false);
  protected formComponent = viewChild(ProjectFormComponent);
  protected buttonsControl = signal<boolean>(false);
  protected loading = computed(() => this.project() === undefined);

  constructor(){
    effect(() => {  
      const projectId = this.projectId();
      if (projectId){
        this._projectsDataService.get(projectId).then(project => {
          this.project.set(project);
          if (project){
            console.log(project.runningOn)
            this.buttonsControl.set(project.runningOn === "PM2");
          }
        });
      } else {
        this._router.navigate(["/projects"]);
      }
    })
  }

  protected onClickEdit(): void {
    this.editMode.set(true);
  }
  protected onClickEditCancel(): void {
    this.editMode.set(false);
  }

  protected onClickSave(): void {
    this.formComponent()?.save().then(() => {
      this._nzMessageService.success("Proyecto actualizado con éxito.");
      this.editMode.set(false);
      this.buttonsControl.set(this.project()?.runningOn === "PM2");
    })
  }

  protected onRunProject(): void {
    const projectId = this.projectId();
    if (projectId){
      this._projectsClientService.runProject(projectId).subscribe({
        next: res => {
          this._nzMessageService.success(res.message ?? "Proyecto iniciado con éxito.");
          this.project()?.update({
            status: "running"
          });
        },
        error: (err: HttpErrorResponse) =>{
          this._nzMessageService.error(err.error.message ?? "Error al iniciar el proyecto.");
        }
      });
    }
  }

  protected onStopProject(): void {
    const project = this.project();
    if (project){
      this._projectsClientService.stopProject(project.id).subscribe({
        next: res => {
          this._nzMessageService.success(res.message ?? "Proyecto detenido con éxito.");
          project.update({
            status: "stopped"
          });
        },
        error: (err: HttpErrorResponse) =>{
          this._nzMessageService.error(err.error.message ?? "Error al detener el proyecto.");
        }
      });
    }
  }

  protected onDeleteProject(): void {
    const projectId = this.projectId();
    if (projectId){
      this._nzModalService.confirm({
        nzTitle: "Eliminar proyecto",
        nzOnOk: () => {
          this._projectsClientService.deleteProject(projectId).subscribe({
            next: res => {
              this._nzMessageService.success(res.message ?? "Proyecto eliminado con éxito.");
              this._projectsDataService.delete(projectId);
              this._router.navigate(["/projects"]);
            },
            error: (err: HttpErrorResponse) =>{
              this._nzMessageService.error(err.error.message ?? "Error al eliminar el proyecto.");
            }
          });
        }
      })
    }
  }

  protected onRestartProject(): void {  
    const projectId = this.projectId();
    if (projectId){
      this._projectsClientService.restartProject(projectId).subscribe({
        next: res => {
          this._nzMessageService.success(res.message ?? "Proyecto reiniciado con éxito.");
          this.project()?.update({
            status: "running"
          });
        },
        error: (err: HttpErrorResponse) =>{
          this._nzMessageService.error(err.error.message ?? "Error al reiniciar el proyecto.");
        }
      });
    }
  }
}
