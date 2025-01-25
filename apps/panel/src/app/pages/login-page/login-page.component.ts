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
  protected readonly disableButtonSignal = signal<boolean>(true);

  protected readonly form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  constructor(){
    this.form.statusChanges.subscribe(status => {
      if (status === "VALID") {
        this.disableButtonSignal.set(false);
      } else {
        this.disableButtonSignal.set(true);
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
    this.loading.set(true);
    this._authService.signIn(formValues.username, formValues.password)
    .then(() => {
      this.loading.set(false);
      this.form.enable();
      this._router.navigate(['/']);
    })
    .catch((err: HttpErrorResponse) => {
      this.loading.set(false);
      if (err.error?.message) {
        this._nzMessage.error(err.error.message);
      } else {
        this._nzMessage.error("Error al iniciar sesión.");
      }
      this.form.enable();
    })
  }
}
