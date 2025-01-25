import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer'
import { AuthService } from '../auth/auth.service';
import { DrawerUserMenuComponent } from '../ui/drawer-user-menu/drawer-user-menu.component';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    NzDrawerModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private readonly _authService = inject(AuthService);
  private readonly _nzDrawerService = inject(NzDrawerService);

  protected readonly username = signal<string>("");

  constructor(){
    this._authService.sessionChanged.subscribe((session) => { 
      this.username.set(session?.name || "");
    })
  }

  protected openDrawerUserMenu(): void {
    this._nzDrawerService.create({
      nzTitle: this.username(),
      nzContent: DrawerUserMenuComponent,
    })
  }
}
