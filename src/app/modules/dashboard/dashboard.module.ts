import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { DashboardRoutingModule } from '@dashboard/dashboard-routing.module';
import { SharedModule } from '@shared/shared.module';
import { DashboardComponent } from '@dashboard/dashboard.component';
import { DashboardPageComponent } from '@dashboard/dashboard-page/dashboard-page.component';
import { ArticleDetailComponent } from '@dashboard/article-detail/article-detail.component';
import { CreateArticleComponent } from '@dashboard/create-article/create-article.component';
import { ProfileComponent } from '@dashboard/profile/profile.component';
import { ArticleCardComponent } from '@dashboard/article-card/article-card.component';
import { FilterModalComponent } from '@dashboard/filter-modal/filter-modal.component';

@NgModule({
  declarations: [
    ArticleDetailComponent,
    CreateArticleComponent,
    ProfileComponent,
    DashboardComponent,
    DashboardPageComponent,
    ArticleCardComponent,
    FilterModalComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    QuillModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DashboardModule {}
