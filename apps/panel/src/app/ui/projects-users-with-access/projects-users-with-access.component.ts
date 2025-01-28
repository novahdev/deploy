import { Component, computed, inject, input, signal } from '@angular/core';
import { AuthService } from '@deploy/panel/auth/auth.service';
import { Project } from '@deploy/panel/common/projects/project.model';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-projects-users-with-access',
  imports: [
    NzButtonModule
  ],
  templateUrl: './projects-users-with-access.component.html',
  styleUrl: './projects-users-with-access.component.scss'
})
export class ProjectsUsersWithAccessComponent {
  private readonly _authService: AuthService = inject(AuthService);
  protected readonly isAdmin = signal<boolean>(false);
  
  public readonly project = input<Project>();
  protected readonly loading = computed(() => this.project() === undefined);
  
  constructor() {
    this._authService.sessionChanged.subscribe(value => {
      this.isAdmin.set(value?.isAdmin ?? false);
    })
  }
}
