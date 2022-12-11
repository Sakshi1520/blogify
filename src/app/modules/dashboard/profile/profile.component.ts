import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@services/user-profile/user.service';
import { AuthService } from '@services/auth/auth.service';
import { NotificationService } from '@services/notification/notification.service';
import { PATH } from '@constants/paths';
import { VALIDATORS } from '@constants/validators';
import { MSG } from '@constants/messages';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user = this.authService.isLoggedIn();
  userId = this.user ? this.user.uid : '';
  PATH = PATH;
  VALIDATORS = VALIDATORS;
  loadedFormData = false;
  loading = false;

  profileForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  })

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private notify: NotificationService,
    ) { }

  get firstName() {
    return this.profileForm.get('firstName');
  }

  get lastName() {
    return this.profileForm.get('lastName');
  }

  get description() {
    return this.profileForm.get('description');
  }

  getUser(): void {
    if(this.userId) {
      this.userService.getUserById(this.userId)
      .then( (user) => {
        this.profileForm.patchValue({
          firstName: user.get('firstName'),
          lastName: user.get('lastName'),
          description: user.get('description')
        })
        this.loadedFormData = true;
      })
    }
  }

  onSubmit(): void {
    if(this.profileForm.valid) {
      this.loading = true;
      const {firstName, lastName, description} = this.profileForm.value;
      this.userService.updateUser(this.userId, firstName, lastName, description)
      .then( () => {
        this.notify.openSnackBar(MSG.PROFILE_UPDATE, MSG.NOTIFICATION_ACTION);
        this.router.navigate([PATH.DASHBOARD])
      })
      .catch( (err) => {
        this.loading = false;
        this.notify.openSnackBar(err, MSG.NOTIFICATION_ACTION);
      })
    }
  }

  ngOnInit(): void {
    this.getUser();
  }
}
