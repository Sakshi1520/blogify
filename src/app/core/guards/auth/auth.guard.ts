import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthModule } from '@auth/auth.module';
import { DashboardModule } from '@dashboard/dashboard.module';
import { AuthService } from '@services/auth/auth.service';
import { PATH } from '@constants/paths';

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
    ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    if(this.authService.isLoggedIn()) {
      if(state.url.includes(PATH.LOGIN) || state.url.includes(PATH.SIGNUP)) {
        this.router.navigate([PATH.DASHBOARD]);
        return false;
      }
      return true;
    }
    else{
      if(state.url.includes(PATH.LOGIN) || state.url.includes(PATH.SIGNUP)) {
        return true;
      }
      this.router.navigate(["/",PATH.LOGIN]);
      return false;
    }
  }
}
