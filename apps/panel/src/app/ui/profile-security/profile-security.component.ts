import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AccessToken } from '@deploy/panel/common/profile/access-token';
import { ProfileClientService } from '@deploy/panel/common/profile/profile-client.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { UpdatePasswordModalComponent } from '../update-password-modal/update-password-modal.component';

@Component({
  selector: 'app-profile-security',
  imports: [
    CommonModule,
    NzButtonModule,
    NzModalModule
  ],
  templateUrl: './profile-security.component.html',
  styleUrl: './profile-security.component.scss'
})
export class ProfileSecurityComponent {
  private readonly _profileClientService: ProfileClientService = inject(ProfileClientService);
  private readonly _nzModalService = inject(NzModalService);

  protected readonly accessTokens=  signal<AccessToken[]>([]);
  constructor(){
    this._profileClientService.getAccessTokens().subscribe((response) => {
      this.accessTokens.set(response.data.map((data) => new AccessToken(data)));
    });
  }

  protected onClickDeleteAccessToken(id: string): void {
    this._profileClientService.deleteAccessToken(id).subscribe(() => {
      this.accessTokens.set(this.accessTokens().filter((accessToken) => accessToken.id !== id));
    });
  }

  protected onClickUpdatePassword(): void {
    this._nzModalService.create({
      nzTitle: "Actualizar contraseña",
      nzContent: UpdatePasswordModalComponent
    })
  }
}
