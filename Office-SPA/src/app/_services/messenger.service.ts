import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { WorkerServiceService } from './worker-service.service';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {
  baseUrl = environment.socketsUrl;
  socket: WebSocket;
  recieved: EventEmitter<string> = new EventEmitter();
  messengerStateChanged: EventEmitter<boolean> = new EventEmitter();
  private messages: Message[] = [];
  senderId: number;
  isInMessengerView: boolean;

  public get ConnectionOpened(): boolean {
    if (this.socket == null) {
      return false;
    }

    return true;
  }

  constructor(private workersService: WorkerServiceService) {
    // console.log('messenger constructor');
    //this.initializeConnection();
  }

  htmlEscape(str): string {
    return str
      .toString()
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  public initializeConnection() {
    // console.log('initializing connection');
    this.openConnection(() => {

     //  console.log("My senderID: " + this.senderId);
      if (this.senderId !== -1) {
        const obj = { senderId: this.senderId, recieverId: -1, messageType: 0, messageContent: 'Connection open request' };
        this.send(obj);
      }
    });
  }

  private openConnection(onConnectionOpen: any) {

    this.senderId = this.workersService.currentWorkerID();
    if (this.senderId === -1) {
      return;
    }
    this.socket = new WebSocket(this.baseUrl);
    // console.log('using url: ' + this.baseUrl);
    this.socket.onopen = event => {
      console.log('connection opened');
      onConnectionOpen();
      const unreadMessagesRequest = { senderId: this.senderId, recieverId: this.senderId, messageType: 4, messageContent: '' };
      this.send(unreadMessagesRequest);
    };

    this.socket.onmessage = event => {
      console.log(this.htmlEscape(event.data));
    };

    this.socket.onclose = event => {
      console.log('socket closed');
    };
  }

  public closeConnection() {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.log('socket was already closed');
    } else {
      console.log('closing connection');
      const closeMessage = { senderId: this.senderId, recieverId: this.senderId, messageType: 1, messageContent: '' };
      this.send(closeMessage);
      this.socket = null;
    }
  }

  send(str: any) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.log('socket not ready or null: returning null');
      return null;
    } else {
      //  console.log('socket ready');
      this.socket.send(JSON.stringify(str));
      this.socket.onmessage = event => {

        let msg: Message = JSON.parse(event.data);
        // console.log(msg);
        msg = Object.assign(msg, {date: new Date(), viewed: false});
        if (msg != null) {
          if (msg.messageType === 2) {
            this.addMessage(msg);
          } else if (msg.messageType === 4 || msg.messageType === 5) {

            const unreadMessages = JSON.parse(msg.messageContent);
            unreadMessages.forEach(element => {
              this.addMessage(element);
            });
            // this.messages.push(unreadMessages);
            // console.log(this.mes)
          }
        }
        // console.log(this.messages);
        // console.log('service recieved');
        this.recieved.emit(JSON.stringify(msg));
      };
    }
  }

  getConnectedUsers() {
    const obj = { senderId: this.senderId, recieverId: -1, messageType: 3, messageContent: '' };
    this.send(obj);
  }

  public get MessengerActive(): boolean {
    return this.isInMessengerView;
  }

  public set MessengerActive(messengerActive: boolean) {
    this.isInMessengerView = messengerActive;
    this.messengerStateChanged.emit(this.isInMessengerView);
  }

  public get Messages(): Message[] {
    return this.messages;
  }

  public addMessage(message: Message) {
    let alreadyIn = false;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.messages.length; i++) {
      if (message.id === this.messages[i].id) {
        alreadyIn = true;
        return;
      }
    }
    this.messages.push(message);
    this.messages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  }

}
