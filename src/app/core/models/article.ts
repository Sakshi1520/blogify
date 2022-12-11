import {firebase} from '@services/firebase/firebase.service';

export interface Article {
  aid: string;
  uid: string;
  creator: string;
  title: string;
  tags: string[];
  description: string;
  htmlStrippedDesc: string;
  timestamp: firebase.firestore.Timestamp;
}
