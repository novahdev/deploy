import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { capitalize } from '@deploy/core/utils/capitalize';
import { definePropertiesOnObject } from '@deploy/core/utils/define-properties-on-object';
import { User } from '@deploy/panel/common/users/user.model';
import { UsersClientService } from '@deploy/panel/common/users/users-client.service';
import { markAllAsDirty } from '@deploy/panel/utils/mark-all-as-dirty';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-user-modal',
  imports: [
    ReactiveFormsModule,
    NzModalModule,
    NzButtonModule,
    NzInputModule,
    NzFormModule,
  ],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.scss'
})
export class UserModalComponent {
  private readonly _usersClientService: UsersClientService = inject(UsersClientService);
  private readonly _nzMessageService: NzMessageService = inject(NzMessageService);
  private readonly _nzModalRef: NzModalRef = inject(NzModalRef);
  protected formGroup: FormGroup = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('admin', { nonNullable: true, validators: [Validators.required] }),
  });

  protected loading = signal<boolean>(false);
  protected disable = signal<boolean>(true);
  protected editMode = signal<boolean>(false);

  constructor(@Inject(NZ_MODAL_DATA) private readonly _data: User | undefined) {

    if (this._data) {
      this.editMode.set(true);
      this.formGroup.setValue({
        name: this._data.name,
        email: this._data.email,
        password: 'admin',
      });
    }

    this.formGroup.statusChanges.subscribe((status) => {
      this.disable.set(status !== "VALID");
    });
  }


  protected onSave(): void {
    if (this.formGroup.invalid) {
      this._nzMessageService.warning("Faltan campos por completar.");
      markAllAsDirty(this.formGroup);
      return;
    }

    const formValue = this.formGroup.value;
    this.formGroup.disable();

    if (this.editMode()){
      const user = this._data as User;
      this._usersClientService.updateUser(user.id, { name: formValue.name, email: formValue.email }).subscribe({
        next: () => {
          this._nzMessageService.success("Usuario actualizado correctamente.");
          definePropertiesOnObject(user, { name: capitalize(formValue.name), email: formValue.email });
          this.formGroup.enable();
          this._nzModalRef.close();
        },
        error: (error: HttpErrorResponse) => { 
          this._nzMessageService.error(error.error.message ?? "Error al actualizar el usuario.");
          this.formGroup.enable();
        }
      });
    } else {
      this._usersClientService.createUser(formValue).subscribe({
        next: res => {
          this._nzMessageService.success("Usuario creado correctamente.");
          this.formGroup.enable();
          this._nzModalRef.close(new User(res.data));
        },
        error: (error: HttpErrorResponse) => {
          this._nzMessageService.error(error.error.message ?? "Error al crear el usuario.");
          this.formGroup.enable();
        }
      });
    }
  }
}
