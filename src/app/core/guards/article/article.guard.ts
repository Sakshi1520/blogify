import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@services/auth/auth.service';
import { ArticleStoreService } from '@services/article-store/article-store.service';
import { PATH } from '@constants/paths';

@Injectable({
  providedIn: 'root'
})
export class ArticleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private articleStoreService: ArticleStoreService,
    private router: Router
    ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    const url = state.url.split('/');
    const paramsId = url[url.length -1];
    const userId = this.authService.isLoggedIn()?.uid;
    return this.articleStoreService.getArticleById(paramsId)
    .then((article) => {
      const uid = article.get('uid');
      if(uid === userId) {
        return true;
      }
      else {
        this.router.navigate([PATH.DASHBOARD]);
        return false;
      }
    });
  }
}
