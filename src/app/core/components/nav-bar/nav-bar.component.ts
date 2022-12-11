import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import firebase from 'firebase/app';
import { AuthService } from '@services/auth/auth.service';
import { PATH } from '@constants/paths';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnDestroy, OnInit {
  private ngUnsubscribe = new Subject<void>();
  user!: firebase.User | null;
  PATH = PATH;
  navLinks = [
  {
    name: 'dashboard',
    path: PATH.DASHBOARD,
    inMenu: false
  },
  {
    name: 'create blog',
    path: PATH.CREATE,
    inMenu: false
  },
  {
    name: 'profile',
    path: PATH.PROFILE,
    inMenu: true
  }
];

  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  logout(): void {
    this.authService.logout()
      .then(() => this.router.navigate([PATH.LOGIN]));
  }

  ngOnInit(): void {
    this.authService.authStatusSub$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => this.user = user);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
