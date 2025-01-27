import { Component, inject, signal } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { UserModalComponent } from '@deploy/panel/ui/user-modal/user-modal.component';
import { UsersClientService } from '@deploy/panel/common/users/users-client.service';
import { User } from '@deploy/panel/common/users/user.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-users-page',
  imports: [
    NzButtonModule,
    NzModalModule,
    NzDropDownModule
  ],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss'
})
export class UsersPageComponent {
  private readonly _nzMessageService: NzMessageService = inject(NzMessageService);
  private readonly _nzModalService: NzModalService = inject(NzModalService);
  private readonly _usersClientService: UsersClientService = inject(UsersClientService);


  protected readonly disabled = signal<boolean>(false);
  protected readonly users = signal<User[]>([]);

  constructor(){
    this.onRefreshClick();
  }

  protected onRefreshClick(): void {
    this.disabled.set(true);
    this._usersClientService.getUsers().subscribe((users) => {
      this.users.set(users.data.map(user => new User(user)));
      this.disabled.set(false);
    });
  }

  protected onAddUserClick(): void {
    this._nzModalService.create({
      nzTitle: "Crear usuario",
      nzContent: UserModalComponent
    }).afterClose.subscribe((res: User | undefined) => {
      if (res){
        this.users.set([...this.users(), res]);
      }
    });
  }

  protected onEditUserClick(user: User): void {
    this._nzModalService.create({
      nzTitle: "Editar usuario",
      nzContent: UserModalComponent,
      nzData: user
    })
  }

  protected onDeleteUserClick(user: User): void {
    this._nzModalService.confirm({
      nzTitle: "¿Eliminar usuario?",
      nzOnOk: () => {
        this._usersClientService.deleteUser(user.id).subscribe({
          next: () => { 
            this.users.set(this.users().filter(u => u.id !== user.id));
          },
          error: () => {
            this._nzMessageService.error("No se pudo eliminar el usuario.");
          }
        });
      }
    })
  }
}
