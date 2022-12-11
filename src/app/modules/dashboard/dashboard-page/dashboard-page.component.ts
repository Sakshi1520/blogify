import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { ActivatedRoute ,Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import firebase from 'firebase/app';
import { Subject, takeUntil } from 'rxjs';
import { FilterModalComponent } from '@dashboard/filter-modal/filter-modal.component';
import { AuthService } from '@services/auth/auth.service';
import { ArticleStoreService } from '@services/article-store/article-store.service';
import { NotificationService } from '@services/notification/notification.service';
import { Article } from '@models/article';
import { DialogData } from '@models/filter-modal';
import { Params } from '@app/core/models/params';
import { PATH } from '@constants/paths';
import { MSG } from '@constants/messages';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  author: string = "";
  tags: string[] = [];
  user!: firebase.User | null;
  PATH = PATH;
  data : Article[] = [];
  dataFireStore: Article[] = [];
  page = 0;
  size = 6;
  filterCount = 0;
  isLoaded = false;
  deleteArticleId!: string;
  selectedTags: string[] = [];
  filterQueryParams: Params = {};
  blogFound = true;

  constructor(
    private articleStoreService : ArticleStoreService,
    private authService: AuthService,
    private dialog: MatDialog,
    private notify: NotificationService,
    private route: ActivatedRoute,
    private router: Router
    ) {}

  getArticlesByFilter(params: DialogData) {
    this.dataFireStore = [];
    this.isLoaded = false;
    this.articleStoreService.getArticlesByFilter(params)
    .then((res) => {
      if(res.docs.length) {
        this.blogFound = true;
        res.docs.forEach( (doc) => {
          this.dataFireStore.push(doc.data() as Article);
        });
        this.getData({pageIndex: this.page, pageSize: this.size, articlesFound: res.docs.length});
        this.isLoaded = true;
      }
      else {
        this.isLoaded = true;
        this.blogFound = false;
        this.notify.openSnackBar(MSG.BLOGS_NOT_FOUND, MSG.NOTIFICATION_ACTION);
      }
    })
  }

  pageChanged(obj: {pageIndex: number, pageSize: number}): void {
    this.page = obj.pageIndex;
    this.size = obj.pageSize;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {...this.filterQueryParams, page: this.page, pageSize: this.size},
      queryParamsHandling: 'merge',
    });
  }

  getData(obj: {pageIndex: number, pageSize: number, articlesFound?: number}): void {
    this.page = obj.pageIndex;
    this.size = obj.pageSize;
    if(obj.articlesFound) {
      var start = obj.pageIndex * obj.pageSize;
      while(obj.articlesFound < start && this.page!=0) {
        this.page--;
      }
    }
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
      this.data = this.dataFireStore.filter(() => {
      index++;
      return index > startingIndex && index <= endingIndex ? true : false;
    });
    this.pageChanged({pageIndex: this.page, pageSize: this.size});
  }

  // Delete Dialog
  openDialog(ref: TemplateRef<string>, aid: string) {
    const dialogRef = this.dialog.open(ref);
    this.deleteArticleId = aid;
  }

  deleteArticle(aid: string) {
    this.articleStoreService.deleteArticle(aid)
    .then( () => {
      this.reloadComponent();
      this.notify.openSnackBar(MSG.BLOG_DELETE, MSG.NOTIFICATION_ACTION);
    })
    .catch( (err) => {
      this.notify.openSnackBar(err, MSG.NOTIFICATION_ACTION);
    });
  }

  reloadComponent() {
      this.router.navigate([PATH.DASHBOARD]);
  }

  // Filter Dialog
  openFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterModalComponent, {
      data: {author: this.author, tags: this.tags},
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.author = result?.author;
      this.selectedTags = [];
      if(result?.tags?.length) {
        this.selectedTags = result.tags;
        let uniqueTags = [...new Set(this.selectedTags)];
        this.selectedTags = uniqueTags;
        this.addToQueryParams({author: result?.author, tags: this.selectedTags});
      }
      else {
        this.addToQueryParams({author: result?.author, tags: result?.tags});
      }
    });
  }

   addToQueryParams(params: DialogData) {
    this.filterQueryParams = params;
    if(params) {
      if(params.author?.length && params.tags?.length){
        this.filterQueryParams = {author: params.author, tags:params.tags};
      }
      else if(params.author?.length) {
        this.filterQueryParams = {author: params.author};
      }
      else if(params.tags?.length) {
        this.filterQueryParams = {tags: params.tags};
      }
      else {
        this.filterQueryParams = {};
      }
      this.filterQueryParams = {...this.filterQueryParams, page: this.page, pageSize: this.size}
    }
    this.navigateToUrl();
  }

  navigateToUrl() {
     this.router.navigate([PATH.DASHBOARD], {queryParams: this.filterQueryParams});
  }

  selectedTag(chip: MatChip) {
    chip.toggleSelected();
    if(chip.selected) {
      this.selectedTags.push(chip.value);
    }
    else {
      this.selectedTags = this.selectedTags.filter( tag => tag!==chip.value);
    }
    this.addToQueryParams({author: this.author, tags: this.selectedTags});
  }

  onFilterReset() {
    this.author = '';
    this.tags = [];
    this.selectedTags = [];
    this.filterQueryParams = {};
    this.page = 0;
    this.size = 6;
    this.router.navigate([PATH.DASHBOARD], {queryParams: {page: this.page, pageSize: this.size}});
  }

  getFilterCount() {
    if(this.author?.length && this.selectedTags?.length) {
      this.filterCount = 2;
    }
    else if(this.author?.length || this.selectedTags?.length) {
      this.filterCount = 1;
    }
    else {
      this.filterCount = 0;
    }
  }

  getValueFromParams(params: Params) {
    if(params) {
      if(params["page"])
        this.page = +params["page"] ? +params["page"] : 0;
      if(params["pageSize"])
        this.size = +params["pageSize"] ? +params["pageSize"] : 6;
      if(params["author"])
        this.author = params["author"];
      if(typeof(params['tags']) === 'string') {
        this.tags.push(params['tags']);
        this.selectedTags = this.tags;
      }
      else if(params['tags']?.length) {
        this.tags = params['tags'];
        this.selectedTags = [...this.tags];
      }
      this.getArticlesByFilter({author: this.author, tags: this.tags});
      this.getFilterCount();
    }
    else {
      this.author = '';
      this.tags = [];
    }
  }
  ngOnInit() {
    this.selectedTags = [];
    this.route.queryParams
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( params => {
      this.author = '';
      this.tags = [];
      this.getValueFromParams(params)
    });

    this.authService.authStatusSub$
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
