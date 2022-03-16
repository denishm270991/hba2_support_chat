import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit } from '@angular/core';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/database';

import { initializeApp } from "firebase/app"



import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { UserI } from './interfaces/user';
import { MessageI } from './interfaces/message';



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
export class AppComponent  {
  // @ViewChild('scrollMe') private myScrollContainer: ElementRef = {};

//   ngOnInit() { 
//     this.scrollToBottom();
// }

// ngAfterViewChecked() {        
//     this.scrollToBottom();        
// } 

// scrollToBottom(): void {
//     try {
//         this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
//     } catch(err) { }                 
// }

  title = 'HBA | Support chat';
  classChat: string;
  classChatHeaderI: string;
  titleChat: string;
  message: string;
  firebaseApp: any;
  uidSelected: string;

  user = {
    uid: 1,
    displayName: 'HBA Support',
    email: ''
  }

  users: UserI[];
  messages: MessageI[];

  constructor() {
    this.messages = [];
    this.classChat = "normal-view";
    this.classChatHeaderI = 'fa fa-long-arrow-left hide';
    this.titleChat = 'Chat Support';
    this.message = '';
    firebase.initializeApp(firebaseConfig);
    this.firebaseApp = initializeApp(firebaseConfig);
    this.users = [];
    this.uidSelected = '';
    this.getUsers();
  }

  async getUsers() {
    const db = getFirestore(this.firebaseApp);
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      this.users.push(doc.data() as UserI);
    });
  }

  getMessages() {
    let messagesRef = firebase.database().ref('messages');
    messagesRef.on("value", (snap) => {
      var data = snap.val();
      this.messages = [];
      for (var key in data) {
        if (data[key].user_sender === this.uidSelected || data[key].user_receive === this.uidSelected) {
          this.messages.push(data[key]);
        }
    
      }
    });
  }

  toActiveUser(uid: string) {
    let widthScreen = window.innerWidth;
    if (widthScreen <= 470) {
      this.classChat = "chat-view-to-write";
      this.classChatHeaderI = 'fa fa-long-arrow-left show';
    }
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].uid === uid) {
        this.users[i].chatActive = true;
        this.uidSelected = this.users[i].uid;
        this.titleChat = this.users[i].displayName;
        this.getMessages();
      } else {
        this.users[i].chatActive = false;
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
      var messagesRef = firebase.database().ref().child("messages");
      messagesRef.push({
        content: this.message,
        user_sender: 'support',
        user_receive: this.uidSelected,
        displayName: 'Team Support'
      });
      this.message = "";
      var objDiv = document.getElementById("your_div");
      if(objDiv){
          objDiv.scrollTop = objDiv.scrollHeight;
      }
    
    }
  }

  onEnterSendMessage() {
    this.sendMessage();
  }
}
