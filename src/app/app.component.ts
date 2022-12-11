import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth/auth.service';
import { UserService } from './core/services/user-profile/user.service';
import { PATH } from '@constants/paths';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'blog-app';

  constructor(
    private authService: AuthService,
    private router: Router,
    private UserService: UserService
    ) { }

  onStorageChanged = () => {
    this.authService.logout().then( () => this.router.navigate([PATH.LOGIN]));
  }

  ngOnInit() {
    window.addEventListener('storage', this.onStorageChanged);
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.onStorageChanged);
  }
}
