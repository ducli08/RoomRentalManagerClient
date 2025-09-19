import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CommonModule } from '@angular/common';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterLink, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, NzAvatarModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  userName = 'User';
  avatarUrl?: string;
  private sub?: Subscription;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.sub = this.authService.currentUser$.subscribe(u => {
      if (u) {
        this.userName = u.username || 'User';
        this.avatarUrl = u.avatarUrl;
      } else {
        this.userName = 'User';
        this.avatarUrl = undefined;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}