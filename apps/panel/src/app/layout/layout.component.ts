import { Component, inject, OnDestroy, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer'
import { AuthService } from '../auth/auth.service';
import { DrawerUserMenuComponent } from '../ui/drawer-user-menu/drawer-user-menu.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    NzDrawerModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnDestroy {
  private readonly _authService = inject(AuthService);
  private readonly _nzDrawerService = inject(NzDrawerService);
  private  _subscriptionUserChange: Subscription | null = null;
  protected readonly username = signal<string>("");

  constructor(){
    this._authService.sessionChanged.subscribe((session) => {
      if (!session) return;
      this._subscriptionUserChange = session.valueChanges.subscribe((data) =>{
        this.username.set(data.name);
      });
    })
  }
  ngOnDestroy(): void {
    if (this._subscriptionUserChange){
      this._subscriptionUserChange.unsubscribe();
    }
  }


  protected openDrawerUserMenu(): void {
    this._nzDrawerService.create({
      nzTitle: this.username(),
      nzContent: DrawerUserMenuComponent,
    })
  }
}
