import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@deploy/panel/auth/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule, NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-drawer-user-menu',
  imports: [
    NzButtonModule,
    NzDrawerModule,
    RouterLink
  ],
  templateUrl: './drawer-user-menu.component.html',
  styleUrl: './drawer-user-menu.component.scss'
})
export class DrawerUserMenuComponent {
  private readonly _userAuthService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _nzDrawerRef = inject(NzDrawerRef);

  protected onClickCloseSession(): void {
    this._userAuthService.logout();
    this._router.navigate(["/login"]);
    this._nzDrawerRef.close();
  }

  public onClose(): void {
    this._nzDrawerRef.close();
  }
}
