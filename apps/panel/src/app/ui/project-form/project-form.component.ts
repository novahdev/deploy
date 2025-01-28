import { Component, effect, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { EnvControlComponent } from '../env-control/env-control.component';
import { Framework, RunningOn, RuntimeEnvironment } from '@deploy/schemas/projects';
import { Project } from '@deploy/panel/common/projects/project.model';
import { markAllAsDirty } from '@deploy/panel/utils/mark-all-as-dirty';
import { ProjectsClientService } from '@deploy/panel/common/projects/projects-client.service';
import { parseProjectRawToObject } from '@deploy/panel/common/projects/parse-project-raw-data-to-object';

@Component({
  selector: 'app-project-form',
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    EnvControlComponent
  ],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent {
  private readonly _projectsClientService: ProjectsClientService = inject(ProjectsClientService);

  protected readonly formGroup = new FormGroup({
    domain: new FormControl<string>("", { nonNullable: true, validators: Validators.required }),
    name: new FormControl<string>("", { nonNullable: true, validators: Validators.required }),
    processName: new FormControl<string>("", { nonNullable: true, validators: Validators.required }),
    location: new FormControl<string>("", { nonNullable: true, validators: Validators.required }),
    startupFile: new FormControl<string>("", { nonNullable: true, validators: Validators.required }),
    url: new FormControl<string>("", { nonNullable: true }),
    framework: new FormControl<Framework | null>(null),
    runningOn: new FormControl<RunningOn | null>(null),
    runtimeEnvironment: new FormControl<RuntimeEnvironment | null>(null),
    ignore: new FormControl<string[]>([], { nonNullable: true }),
    env: new FormControl<{ key: string, value: string }[]>([], { nonNullable: true })
  });

  protected listIgnoreFiles = signal<string[]>([]);
  public readonly project = input<Project>();

  constructor(){
    effect(() => {
      const product = this.project();
      if (product){
        this.listIgnoreFiles.set(structuredClone(product.ignore));
        const env: { key: string, value: string }[] = []
        Object.entries(product.env).forEach(item => {
          env.push({ key: item[0], value: item[1] });
        })
        this.formGroup.setValue({
          domain: product.domain ?? "",
          name: product.name ?? "",
          processName: product.processName ?? "",
          framework: product.framework ?? null,
          runningOn: product.runningOn ?? null,
          runtimeEnvironment: product.runtimeEnvironment ?? null,
          location: product.location ?? "",
          ignore: product.ignore,
          startupFile: product.startupFile,
          env: env,
          url: product.url ?? ""
        });
      }
    })

    const projectForm = localStorage.getItem("project-form");

    if (projectForm){
      this.formGroup.setValue(JSON.parse(projectForm));
    }

    this.formGroup.valueChanges.subscribe(value => {
      if (!this.project()){
        localStorage.setItem("project-form", JSON.stringify(value));
      }
    });

  }

  public get valid(){
    const valid = this.formGroup.valid;
    if (!valid){
      markAllAsDirty(this.formGroup);
    }
    return this.formGroup.valid;
  }

  public get invalid(){
    const invalid = this.formGroup.invalid;
    if (invalid){
      markAllAsDirty(this.formGroup);
    }
    return this.formGroup.invalid;
  }

  public disable(){
    this.formGroup.disable();
  }

  public enable(){
    this.formGroup.enable();
  }

  public getRawValue(){
    const values = this.formGroup.getRawValue();
    const env: { [key: string]: string } = {};
    values.env.forEach(item => {
      env[item.key] = item.value
    })

    return {
      domain: values.domain,
      name: values.name,
      processName: values.processName,
      location: values.location,
      startupFile: values.startupFile,
      framework: values.framework ?? null,
      runningOn: values.runningOn ?? null,
      runtimeEnvironment: values.runtimeEnvironment ?? null,
      ignore: values.ignore,
      env: env,
      url: values.url ?? null
    }
  }

  public save(): Promise<Project | undefined>{
    return new Promise((resolve, reject) => {
      if (this.invalid){
        reject(new Error("Invalid form"));
        return;
      }
  
      const project = this.project();
      const formValues = this.getRawValue();
      if (project){
        this._projectsClientService.updateProject(project.id, {
          domain: formValues.domain,
          name: formValues.name,
          process_name: formValues.processName,
          location: formValues.location,
          startup_file: formValues.startupFile,
          framework: formValues.framework,
          running_on: formValues.runningOn,
          runtime_environment: formValues.runtimeEnvironment,
          ignore: formValues.ignore,
          env: formValues.env,    
          url: formValues.url
        }).subscribe({
          next: res => {
            project.update(parseProjectRawToObject(res.data));
            resolve(undefined);
          },
          error: reject
        });
      }
    })

  }
}
