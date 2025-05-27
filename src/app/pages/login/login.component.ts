import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
})
export class LoginComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    // Initialize any data or services needed for the login component
  }

  onLogin(): void {
    // Handle login logic here
  }

}
