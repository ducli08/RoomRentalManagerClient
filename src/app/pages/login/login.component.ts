import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceProxy } from '../../shared/service.proxies';
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  constructor(private router: Router, private _serviceProxy: ServiceProxy) { }

  ngOnInit(): void {
    // Initialize any data or services needed for the login component
  }

  onLogin(): void {
    if (this.username && this.password) {
      if (this.rememberMe) {
        this._serviceProxy.login(this.username, this.password, this.rememberMe).subscribe(
          (res: any) => {
            if (res && res.accessToken) {
              localStorage.setItem('access_token', res.accessToken);
              localStorage.setItem('user', JSON.stringify(res.user));
              if (this.rememberMe) {
                localStorage.setItem('remember_me', 'true');
              } else {
                localStorage.removeItem('remember_me');
              }
              this.router.navigate(['/main']);
            } else {
              console.error('Login failed: Invalid response', res);}
          },
          (error) => {
            console.error('Login failed', error);
          }
        );
      }
      else {
        localStorage.removeItem('remember_me');
      }
    }
  }
  onForgotPassword(event: Event): void {
    // Handle forgot password logic here
  }
}
