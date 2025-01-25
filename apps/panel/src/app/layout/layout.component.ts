import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private readonly _authService = inject(AuthService);
  protected readonly username = signal<string>("");

  constructor(){
    this._authService.sessionChanged.subscribe((session) => { 
      this.username.set(session?.name || "");
    })
  }

}
