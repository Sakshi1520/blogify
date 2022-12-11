import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '@dashboard/dashboard.component';
import { DashboardPageComponent } from '@dashboard/dashboard-page/dashboard-page.component';
import { ArticleDetailComponent } from '@dashboard/article-detail/article-detail.component';
import { CreateArticleComponent } from '@dashboard/create-article/create-article.component';
import { ProfileComponent } from '@dashboard/profile/profile.component';
import { PageNotFoundComponent } from '@components/page-not-found/page-not-found.component';
import { ArticleGuard } from '@guards/article/article.guard';
import { PATH } from '@constants/paths';

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent,
		children: [
			{
				path: PATH.DASHBOARD,
				component: DashboardPageComponent,
			},
			{
				path: PATH.CREATE,
				component: CreateArticleComponent,
			},
			{
				path: PATH.CREATE.concat('/:id'),
				component: CreateArticleComponent,
				canActivate: [ArticleGuard],
			},
			{
				path: PATH.ARTICLE.concat('/:id'),
				component: ArticleDetailComponent,
			},
			{
				path: PATH.PROFILE,
				component: ProfileComponent,
			},
			{
				path: '**',
				component: PageNotFoundComponent,
			},
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DashboardRoutingModule {}
