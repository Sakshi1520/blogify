import { Component, OnDestroy, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Subject, takeUntil } from 'rxjs';
import { ArticleStoreService } from '@services/article-store/article-store.service';
import { NotificationService } from '@services/notification/notification.service';
import { Article } from '@models/article';
import { PATH } from '@constants/paths';
import { VALIDATORS } from '@constants/validators';
import { MSG } from '@constants/messages';
import { QUILLCONFIG } from '@constants/quill-editor';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss'],
})
export class CreateArticleComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  addOnBlur = true;
  loading: Boolean = false;
  loadedFormData: Boolean = false;
  form: Article[] = [];
  PATH = PATH;
  VALIDATORS = VALIDATORS;
  MODULES = QUILLCONFIG.MODULES;
  EDITORSTYLE = QUILLCONFIG.EDITORSTYLE;
  editorText: string = '';
  aid: string | null = null;
  articleForm!: FormGroup;
  descriptionEmpty!: Boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleStoreService,
    private notify: NotificationService,
    ) { }

  get title() {
    return this.articleForm.get('title');
  }

  get tags() {
    return this.articleForm.get('tags');
  }

  get description() {
    return this.articleForm.get('description');
  }

  onSubmit(): void {
    if(this.articleForm.get('description')?.value === '') {
      this.descriptionEmpty = true;
    }
    else {
      this.descriptionEmpty = true;
    }
    if (this.articleForm.valid) {
      this.loading = true;
      const { title, tags, description } = this.articleForm.value;

      if (this.aid) {
        this.articleService
          .updateArticle(this.aid, title, tags, description)
          .then(() => {
            this.notify.openSnackBar(MSG.BLOG_UPDATE, MSG.NOTIFICATION_ACTION);
            this.router.navigate([PATH.DASHBOARD]);
          })
          .catch((err) =>
            this.notify.openSnackBar(err, MSG.NOTIFICATION_ACTION)
          );
      } else {
        this.articleService
          .storeArticle(title, tags, description)
          .then(() => {
            this.notify.openSnackBar(MSG.BLOG_CREATE, MSG.NOTIFICATION_ACTION);
            this.router.navigate([PATH.DASHBOARD]);
          })
          .catch((err) =>
            this.notify.openSnackBar(err, MSG.NOTIFICATION_ACTION)
          );
      }
    }
  }

  loadPopulatedForm(aid: string): void {
    this.articleService.getArticleById(aid)
    .then((article) => {
      if(article.exists) {
        this.articleForm.patchValue({
          title: article.get('title'),
          tags: article.get('tags'),
          description: article.get('description'),
        });
        this.loadedFormData = true;
      }
      else {
        this.router.navigate([PATH.DASHBOARD]);
        this.notify.openSnackBar(MSG.BLOGS_NOT_FOUND, MSG.NOTIFICATION_ACTION);
      }
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if(this.tags?.value.length <= 10) {
      if(value.length <= 20) {
        if (value && !this.tags?.value.includes(value)) {
          this.tags?.value.push(value)
          this.tags?.updateValueAndValidity();
        }
        else if(this.tags?.value.includes(value)){
          this.notify.openSnackBar(MSG.TAG_UNIQUE, MSG.NOTIFICATION_ACTION)
        }
      }
      else {
        this.notify.openSnackBar(MSG.TAG_MAX_LENGTH, MSG.NOTIFICATION_ACTION)
      }
    }
    else {
      this.notify.openSnackBar(MSG.TAG_MAX, MSG.NOTIFICATION_ACTION)
    }
    event.chipInput?.clear();
  }

  remove(tag: string): void {
    const index = this.tags?.value.indexOf(tag);
    if (index >= 0) {
      this.tags?.value.splice(index, 1);
      this.tags?.updateValueAndValidity();
    }
  }


  ngOnInit(): void {
    this.articleForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(VALIDATORS.MIN_LENGTH),
      ]),
      tags: new FormControl([], Validators.required),
      description: new FormControl('', Validators.required),
    });

    this.route.paramMap
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        this.aid = params.get('id');
        // Load Empty Form
        if (!this.aid) {
          this.loadedFormData = true;
        } else {
          // Load Data from Firestore
          this.loadPopulatedForm(this.aid);
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
