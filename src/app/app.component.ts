import { Component } from '@angular/core';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/database';

import { initializeApp } from "firebase/app"



import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { UserI } from './interfaces/user';



const config = {
  apiKey: '',
  databaseUrl: ''
}

const firebaseConfig = {
  apiKey: "AIzaSyDE3IkmgIdxh_NDWuFf78jR5GRv2eelad4",
  authDomain: "hba2022-e5821.firebaseapp.com",
  databaseURL: "https://hba2022-e5821-default-rtdb.firebaseio.com",
  projectId: "hba2022-e5821",
  storageBucket: "hba2022-e5821.appspot.com",
  messagingSenderId: "239569286794",
  appId: "1:239569286794:web:0966c7e3330cdcd5c01f73",
  measurementId: "G-J6ZLJ2MNQ6"
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'HBA | Support chat';
  classChat: string;
  classChatHeaderI: string;
  titleChat: string;
  message: string;
  firebaseApp: any;

  user = {
    uid: 1,
    displayName: 'HBA Support',
    email: ''
  }

  users: UserI[];
  messages: string[];

  constructor() {
    this.messages = ['Como compro una casa', 'Que debo hacer, necesito orientacion', 'Hola esta??'];
    this.classChat = "normal-view";
    this.classChatHeaderI = 'fa fa-long-arrow-left hide';
    this.titleChat = 'Chat Support';
    this.message = '';
    firebase.initializeApp(firebaseConfig);
    this.firebaseApp = initializeApp(firebaseConfig);
    this.users = [];
    // this.getMessages();
    this.getUsers();
  }

  async getUsers() {
    const db = getFirestore(this.firebaseApp);
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      this.users.push(doc.data() as UserI);
    });
  }
  getMessages() {
    let messagesRef = firebase.database().ref('messages');
    messagesRef.on("value", (snap) => {
      var data = snap.val();
      console.log(data);
      // console.log(this.user);
      // this.messages = [];
      // for (var key in data) {
      //   if (data[key].user_sender === this.user.uid || data[key].user_receive === this.user.uid) {
      //     this.messages.push(data[key]);
      //   }
      // }
    });
  }

  toActiveUser(displayName: string) {
    let widthScreen = window.innerWidth;
    console.log(widthScreen);
    if (widthScreen <= 470) {
      this.classChat = "chat-view-to-write";
      this.classChatHeaderI = 'fa fa-long-arrow-left show';
      this.titleChat = displayName;
    } else {
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].displayName === displayName) {
          this.users[i].chatActive = true;
        } else {
          this.users[i].chatActive = false;
        }
      }
    }
  }

  showUsersList() {
    this.classChat = "normal-view";
    this.classChatHeaderI = 'fa fa-long-arrow-left hide';
    this.titleChat = 'Chat Support';
  }

  sendMessage() {
    if (this.message != '') {
      console.log(this.message);
      // TODO save message on firebase
      this.message = '';
    }
  }

  onEnterSendMessage() {
    this.sendMessage();
  }
}
