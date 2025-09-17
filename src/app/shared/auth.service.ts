import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { ServiceProxy, LoginResponseDto, RefreshRequestDto } from './service.proxies';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private proxy: ServiceProxy, private router: Router) {}

  login(username: string, password: string, rememberMe: boolean): Observable<LoginResponseDto> {
    return this.proxy.login(username, password, rememberMe).pipe(
      tap(res => {
        if (res && res.accessToken) {
          this.saveTokens(res, rememberMe);
        }
      })
    );
  }

  logout(): void {
    this.clearStorage();
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  }

  isTokenExpired(bufferSeconds = 60): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    const payload = this.parseJwt(token);
    if (!payload || !payload.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= (now + bufferSeconds);
  }

  ensureValidToken(): Observable<boolean> {
    const token = this.getAccessToken();
    if (!token) return of(false);
    if (!this.isTokenExpired()) return of(true);

    const remember = localStorage.getItem('remember_me') === 'true';
    if (!remember) {
      this.clearStorage();
      this.router.navigate(['/login']);
      return of(false);
    }

    const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.clearStorage();
      this.router.navigate(['/login']);
      return of(false);
    }

    const req = new RefreshRequestDto({ userId: undefined as any, refreshToken, rememberMe: true });
    return this.proxy.refresh(req).pipe(
      map(() => {
        // After refresh, server might have provided new token.
        const newTok = this.getAccessToken();
        if (newTok) return true;
        // If server did not return token in body, client must coordinate with backend (cookies, headers)
        this.clearStorage();
        this.router.navigate(['/login']);
        return false;
      }),
      catchError((err) => {
        console.error('Refresh failed', err);
        this.clearStorage();
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }

  // helpers
  private saveTokens(res: LoginResponseDto, remember: boolean) {
    if (res.accessToken) {
      if (remember) localStorage.setItem('access_token', res.accessToken);
      else sessionStorage.setItem('access_token', res.accessToken);
    }
    if (res.refreshToken) {
      if (remember) localStorage.setItem('refresh_token', res.refreshToken);
      else sessionStorage.setItem('refresh_token', res.refreshToken);
    }
    if (res.expiresAt) {
      const exp = new Date(res.expiresAt).toISOString();
      if (remember) localStorage.setItem('expires_at', exp);
      else sessionStorage.setItem('expires_at', exp);
    } else if (res.expiresIn) {
      const exp = new Date(Date.now() + res.expiresIn * 1000).toISOString();
      if (remember) localStorage.setItem('expires_at', exp);
      else sessionStorage.setItem('expires_at', exp);
    }
    if (remember) localStorage.setItem('remember_me', 'true');
    else localStorage.removeItem('remember_me');
  }

  private clearStorage() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('remember_me');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('expires_at');
  }

  private parseJwt(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }
}
