import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ArticleStoreService } from '@services/article-store/article-store.service';
import { AuthService } from '@services/auth/auth.service';
import { NotificationService } from '@services/notification/notification.service';
import { Article } from '@models/article';
import { PATH } from '@constants/paths';
import { MSG } from '@constants/messages';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  aid! : string | null;
  currentArticle!: Article;
  isLoaded: Boolean = false;
  PATH = PATH;
  userId?: string = this.authService.isLoggedIn()?.uid;
  deleteArticleId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleStoreService: ArticleStoreService,
    private authService: AuthService,
    private dialog: MatDialog,
    private notify: NotificationService,
    ) {}

  loadArticle(aid: string): void {
    this.articleStoreService.getArticleById(aid)
    .then( (article) => {
      if(article.exists) {
        this.currentArticle = article.data() as Article;
        this.isLoaded = true;
      }
      else {
        this.router.navigate([PATH.DASHBOARD]);
        this.notify.openSnackBar(MSG.BLOGS_NOT_FOUND, MSG.NOTIFICATION_ACTION);
      }
    });
  }

  deleteArticle(aid : string): void {
    this.articleStoreService.deleteArticle(aid)
    .then( () => {
      this.router.navigate([PATH.DASHBOARD]);
    })
    this.notify.openSnackBar(MSG.BLOG_DELETE, MSG.NOTIFICATION_ACTION);
  }

  openDialog(ref: TemplateRef<any>, aid: string): void {
    const dialogRef = this.dialog.open(ref);
    this.deleteArticleId = aid;
  }

  ngOnInit(): void {
    this.route.paramMap
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(params => {
      this.aid = params.get('id');
      if (this.aid) {
        this.loadArticle(this.aid);
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
