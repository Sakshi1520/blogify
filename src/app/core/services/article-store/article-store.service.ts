import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { firebase, articles } from '@services/firebase/firebase.service';
import { AuthService } from '@services/auth/auth.service';
import { DialogData } from '@models/filter-modal';

@Injectable({
  providedIn: 'root',
})
export class ArticleStoreService {
  userData!: firebase.User | null;

  constructor(private authService: AuthService) { }

  getArticles(): Promise<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>> {
    return articles.orderBy('timestamp', 'desc').get();
  }

  getArticlesByFilter(params: DialogData)
  : Promise<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>> {
    if(params.tags?.length && params.author) {
      const res = articles.where("tags" ,"array-contains-any", params.tags)
      .where("creator", "==", params.author).orderBy('timestamp', 'desc').get();
      return res;
    }
    else if (params.tags?.length && !params.author) {
      const res = articles.where("tags" ,"array-contains-any", params.tags).orderBy('timestamp', 'desc')
      .get();
      return res;
    }
    else if(params.author && !params.tags?.length) {
      const res = articles.where("creator", "==", params.author).orderBy('timestamp', 'desc').get();
      return res;
    }
    else {
      const res = articles.orderBy('timestamp', 'desc').get();
      return res;
    }
  }

  getArticleById(aid: string): Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>> {
    return articles.doc(aid).get();
  }

  updateArticle(aid: string, title: string, tags: string[], description: string)
  : Promise<void> {
    this.userData = this.authService.isLoggedIn();
    const res = articles.doc(aid).update({
      uid: this.userData?.uid,
      title: title,
      description: description,
      htmlStrippedDesc: description.replace(/(<([^>]+)>)/gi, ""),
      tags: tags,
      timestamp: firebase.firestore.Timestamp.now()
    })
    return res;
  }

  storeArticle(title : string, tags: string[], description: string)
  : Promise<void> {
    this.userData = this.authService.isLoggedIn();
    const newId = uuidv4();
    var strippedString = description.replace(/(<([^>]+)>)/gi, "");
    const res = articles.doc(newId).set({
      aid: newId,
      uid: this.userData?.uid,
      creator: this.userData?.displayName,
      title: title,
      description: description,
      htmlStrippedDesc: strippedString,
      tags: tags,
      timestamp: firebase.firestore.Timestamp.now(),
    });
    return res;
  }

  deleteArticle(aid: string): Promise<void> {
    return articles.doc(aid).delete();
  }
}
