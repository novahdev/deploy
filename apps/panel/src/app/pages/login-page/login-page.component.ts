import { Component, inject, signal } from '@angular/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { markAllAsDirty } from '@deploy/panel/utils/mark-all-as-dirty';
import { AuthService } from '@deploy/panel/auth/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzButtonModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private readonly _nzMessage = inject(NzMessageService);
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);

  protected readonly loading = signal<boolean>(false);

  protected readonly form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  constructor(){
    this.form.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        this.loading.set(false);
      } else {
        this.loading.set(true);
      }
    })
  }

  protected onSignIn(): void {
    if (this.form.invalid) {
      markAllAsDirty(this.form);
      this._nzMessage.warning("Faltan campos por completar.");
      return;
    }

    const formValues = this.form.getRawValue();
    this.form.disable();
    this._authService.signIn(formValues.username, formValues.password)
    .then(() => {
      this.form.enable();
      this._router.navigate(['/']);
    })
    .catch((err: HttpErrorResponse) => {
      if (err.error?.message) {
        this._nzMessage.error(err.error.message);
      } else {
        this._nzMessage.error("Error al iniciar sesión.");
      }
      this.form.enable();
    })
  }
}
