import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { AuthService } from '@services/auth/auth.service';
import { UserService } from '@services/user-profile/user.service';
import { FormValidationService } from '@services/form-validation/form-validation.service';
import { PATH } from '@constants/paths';
import { VALIDATORS } from '@constants/validators';
import { USER } from '@constants/user';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  userData! : firebase.User | null;
  message : string = '';
  loading : Boolean = false;
  VALIDATORS = VALIDATORS;
  PATH = PATH;

  signUpForm = new FormGroup({
    displayName: new FormControl('', [
      Validators.required,
      Validators.minLength(VALIDATORS.MIN_LENGTH),
      Validators.maxLength(VALIDATORS.MAX_LENGTH)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(VALIDATORS.MIN_LENGTH)
    ]),
    confirmPassword: new FormControl('', Validators.required)
  },
  { validators : this.formValidationService.passwordsMatchValidator() }
  );

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private formValidationService : FormValidationService
    ) { }

  get displayName() {
    return this.signUpForm.get('displayName');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  signUp(): void {
    const { displayName, email, password } = this.signUpForm.value;
    this.authService.signup(displayName, email, password)
    .then( (res) => {
      this.userData = res.user;
      this.userData?.updateProfile({displayName : displayName})
      .then( () => {
        this.authService.authStatusSub$.next(this.userData);
        sessionStorage.setItem(USER, JSON.stringify(this.userData));
      });
      this.storeUserToDb();
    })
    .catch( (err) => {
      this.loading = false;
      this.message = err.message;
    });
  }

  storeUserToDb(): void {
    const { displayName, email, password } = this.signUpForm.value;
    const uid = this.userData ? this.userData.uid : '';
    this.userService.storeUser(uid, email, displayName)
    .catch( (err) => {
      console.log(err);
      this.loading = false;
      this.message = err.message;
    });
    this.router.navigate([PATH.PROFILE]);
  }

  onSubmit(): void {
    if(this.signUpForm.valid) {
      this.loading = true;
      this.signUp();
    }
  }
}
