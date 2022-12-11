import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from '@auth/auth.component';
import { SignInComponent } from '@auth/sign-in/sign-in.component';
import { SignUpComponent } from '@auth/sign-up/sign-up.component';
import { PATH } from '@constants/paths';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: PATH.LOGIN,
        component: SignInComponent,
      },
      {
        path: PATH.SIGNUP,
        component: SignUpComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
