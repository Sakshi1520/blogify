import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatChip } from '@angular/material/chips';
import { firebase } from '@services/firebase/firebase.service'
import { ArticleStoreService } from '@services/article-store/article-store.service';
import { NotificationService } from '@services/notification/notification.service';
import { Article } from '@models/article';
import { PATH } from '@constants/paths';
import { MSG } from '@constants/messages';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {
  @Input() article! : Article;
  @Input() user!: firebase.User | null;
  @Input() selectedTags!: string[];
  @Output() deleteArticleEvent = new EventEmitter<string>();
  @Output() tagSelectedEvent = new EventEmitter<MatChip>();
  PATH = PATH;
  MSG = MSG;
  deleteArticleId: string = '';

  constructor(
    private articleStoreService: ArticleStoreService,
    private dialog: MatDialog,
    private notify: NotificationService,
    private router: Router,
    ) { }

  openDialog(ref: TemplateRef<string>, aid: string) {
    const dialogRef = this.dialog.open(ref);
    this.deleteArticleId = aid;
  }

  deleteArticle(aid : string) {
    this.deleteArticleEvent.emit(aid);
  }

  addTag(chip: MatChip) {
    this.tagSelectedEvent.emit(chip);
  }
}
