import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  constructor() { }

  ngOnInit(): void {
    // Initialize any data or services needed for the login component
  }

  onLogin(): void {
    // Handle login logic here
  }
  onForgotPassword(event: Event): void {
    // Handle forgot password logic here
  }
}
