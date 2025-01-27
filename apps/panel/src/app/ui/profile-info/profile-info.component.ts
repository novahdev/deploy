import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@deploy/panel/auth/auth.service';
import { ProfileClientService } from '@deploy/panel/common/profile/profile-client.service';
import { markAllAsDirty } from '@deploy/panel/utils/mark-all-as-dirty';
import { capitalize } from '@deploy/core/utils/capitalize';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-profile-info',
  imports: [
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.scss'
})
export class ProfileInfoComponent {
  private readonly _authService = inject(AuthService);
  private readonly _profileClientService = inject(ProfileClientService);
  private readonly _nzMessage = inject(NzMessageService);
  protected readonly editProfile = signal<boolean>(false);
  protected readonly data = signal<{name: string, email: string}>({name: "Cargando...", email: "Cargando..."});
  
  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: Validators.required}),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email]}),
  });

  constructor(){
    this._profileClientService.getProfile().subscribe((profile) => {
      this.data.set(profile.data);
    });
  }

  protected onClickEditProfile(): void {
    this.editProfile.set(true);
    const { name, email } = this.data();
    this.form.setValue({ name, email });
  }

  protected onClickCancelEditProfile(): void {
    this.editProfile.set(false);
  }

  protected onClickSaveProfile(): void {
    if (this.form.invalid){
      markAllAsDirty(this.form);
      this._nzMessage.warning("Por favor, completa los campos requeridos");
      return;
    }

    const values = this.form.getRawValue();
    values.name = capitalize(values.name);
    this.form.disable();

    this._profileClientService.updateProfile(values).subscribe({
      next: () => {
        this.data.set(values);
        this._nzMessage.success("Perfil actualizado correctamente");
        this.form.enable();
        this.editProfile.set(false);
        const session = this._authService.session;
        if (session){
          session.update(values);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.form.enable();
        this._nzMessage.error(error.error.message ?? "Error al actualizar el perfil");
      }
    })
  }
}
