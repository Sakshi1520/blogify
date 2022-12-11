import { Injectable } from '@angular/core';
import { firebase, db, userDb } from '../firebase/firebase.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private authService: AuthService) { }

  getUsers(): Promise<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>> {
    return userDb.get();
  }

  getUserById(aid: string)
  : Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>> {
    return userDb.doc(aid).get();
  }

  updateUser(uid: string , firstName: string, lastName:string, description: string)
  : Promise<void> {
    const res = userDb.doc(uid).update({
      firstName: firstName,
      lastName: lastName,
      description: description,
    })
    return res;
  }

  storeUser(uid: string, email: string, displayName: string)
  : Promise<void> {
    const res = userDb.doc(uid).set({
      email: email,
      displayName: displayName
    })
    return res;
  }
}
