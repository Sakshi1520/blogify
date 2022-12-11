import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { PATH } from '@constants/paths';
import { MSG } from '@constants/messages';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  PATH = PATH;
  loading: Boolean = false;
  message: string = '';

  signInForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
    ) { }

  get email() {
    return this.signInForm.get('email');
  }

  get password() {
    return this.signInForm.get('password');
  }

  onSubmit(): void {
    if (this.signInForm.valid) {
      // For Submit button Loader
      this.loading = true;
      const { email, password } = this.signInForm.value;
      this.authService.login(email, password)
      .then( () => this.router.navigate([PATH.DASHBOARD]))
      .catch( (err) => {
        this.loading = false;
        this.message = MSG.USER_INVALID;
      });
    }
  }
}
