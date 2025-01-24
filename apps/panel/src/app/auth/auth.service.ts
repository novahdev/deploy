import { inject, Injectable } from '@angular/core';
import { AuthClientService } from './auth-client.service';
import { Session } from './session';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _session: Session | null = null;
  private readonly _apiAuthClient = inject(AuthClientService);
  private readonly _sessionSubject = new BehaviorSubject<Session | null>(null);


  public init(): void {
    const token = localStorage.getItem("app-token");
    if (token) {
      this._session = new Session(JSON.parse(window.atob(token)));
      this._sessionSubject.next(this._session);
    }
  }

  public get session(): Session | null {
    return this._session;
  }

  public get isLoggedIn(): boolean {
    return !!this._session;
  }

  public get sessionChanged() {
    return this._sessionSubject.asObservable();
  }

  public signIn(username: string, password: string): Promise<void> { 
    return new Promise((resolve, reject) => {
      this._apiAuthClient.signIn(username, password).subscribe({
        next: response => {
          this._session = new Session(response.data);
          localStorage.setItem("app-token", window.btoa(JSON.stringify(response.data)));
          this._sessionSubject.next(this._session);
          resolve();
        },
        error: reject
      })
    })
  }

  public logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._apiAuthClient.logout().subscribe({
        next: () => {
          localStorage.removeItem("app-token");
          this._session = null;
          this._sessionSubject.next(null);
          resolve();
        },
        error: reject
      })
    })
  }
}
