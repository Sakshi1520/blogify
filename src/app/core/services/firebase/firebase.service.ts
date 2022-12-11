import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { environment } from '@environments/environment';

firebase.initializeApp(environment.firebase);
const auth = firebase.auth();
const db = firebase.firestore();
const articles = db.collection('articles');
const userDb = db.collection('users');

export { firebase, auth, db, articles, userDb };
