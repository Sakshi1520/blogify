import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { firebase, auth} from '@services/firebase/firebase.service';
import { USER } from '@constants/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData!: firebase.User | null;
  currentUser = auth.currentUser;
  authStatusSub$ = new BehaviorSubject(this.currentUser);

  authStatusListener(): void {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.userData = user;
        this.authStatusSub$.next(this.userData);
        sessionStorage.setItem(USER, JSON.stringify(this.userData));
      } else {
        this.authStatusSub$.next(null);
        sessionStorage.setItem(USER, JSON.stringify(null));
      }
    });
  }

  login(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return auth.signInWithEmailAndPassword(email, password);
  }

  signup(name: string, email: string, password: string): Promise<firebase.auth.UserCredential> {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  logout(): Promise<void> {
    sessionStorage.removeItem(USER);
    return auth.signOut();
  }

  isLoggedIn(): firebase.User | null {
    var user: firebase.User = JSON.parse(sessionStorage.getItem(USER)!);
    if (user) {
      this.authStatusSub$.next(user);
      return user;
    }
    else
      return null;
  }
}
