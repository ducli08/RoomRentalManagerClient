import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
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
  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
    // Initialize any data or services needed for the login component
  }

  onLogin(): void {
    if (this.username && this.password) {
      this.auth.login(this.username, this.password, this.rememberMe).subscribe(
        (res) => {
          if (res && res.accessToken) {
            if (res.user) localStorage.setItem('user', JSON.stringify(res.user));
            this.router.navigate(['/main']);
          } else {
            console.error('Login failed: Invalid response', res);
          }
        },
        (error) => {
          console.error('Login failed', error);
        }
      );
    }
  }
  onForgotPassword(event: Event): void {
    // Handle forgot password logic here
  }
}
