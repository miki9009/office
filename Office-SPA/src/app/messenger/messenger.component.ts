import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy} from "@angular/core";
import { MessengerService } from "../_services/messenger.service";
import { WorkerServiceService } from "../_services/worker-service.service";
import { Worker } from "../_models/worker";
import { Message } from "../_models/message";
import { Subject } from 'rxjs';
import { OfficeService } from '../_services/Office.service';
// https://github.com/aspnet/AspNetCore.Docs/blob/master/aspnetcore/fundamentals/websockets/samples/2.x/WebSocketsSample/wwwroot/index.html
// http://sebcza.pl/programowanie/websocket-asp-net-core/

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MessengerComponent implements OnInit, AfterViewInit, OnDestroy {
  socket: WebSocket;
  senderId: number;
  workers: Worker[] = [];
  currentContact: Worker;
  messagesContainer: any;
  subscription: any;

  constructor(private messengerService: MessengerService, private workerService: WorkerServiceService,
    private OfficeService: OfficeService) {
    // console.log('constructor');
  }

  socketConnected: Subject<number> = new Subject<number>();
  socketDisconnected: Subject<number> = new Subject<number>();
  notificationSend: Subject<number> = new Subject<number>();

  ngOnInit() {
    this.messengerService.MessengerActive = true;
    this.subscription = this.messengerService.recieved.subscribe((data) => {
      // console.log('did emit');
      // console.log(data);
      this.onMessage(data);
    });

    this.senderId = this.workerService.currentWorkerID();
    this.workerService.getMyWorkers(this.OfficeService.getOfficeID()).subscribe(data => {
      this.workers = data;
      this.messengerService.getConnectedUsers();
      this.workers.forEach(worker => {
        if (worker.id === this.senderId) {
         this.currentContact = worker;
        }
      });
      // console.log(this.workers);
    });


  }

  ngOnDestroy() {
    this.messengerService.MessengerActive = false;
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.getContainer();
  }

  send() {
    if (this.currentContact === null) {
      // console.log('contact was null');
      return;
    }
    const element: any = document.getElementById('send-message-input');
    const msg = element.value;
    if (msg === null || msg === '') {
      return;
    }
    const obj = { senderId: this.senderId, recieverId: this.currentContact.id, messageType: 2, messageContent: msg};
    this.messengerService.send(obj);
    const m = Object.assign(obj, {date: new Date(), viewed: false, id: -1});

    if (this.currentContact.id !== this.senderId) {
      const localMessage: Message = m;
      this.createMessage(localMessage, false);
      this.messengerService.addMessage(m);
    }

    element.value = '';
    element.focus();
  }

  private createMessage(message: Message, fromServer: boolean) {

    message.viewed = true;
    let element: any;
    if (!fromServer) {
      // tslint:disable-next-line: max-line-length
      element = '<div class="message-row"><div class="message message-sender"><p>'  + message.messageContent + '</p></div></div>';
    } else if (message.recieverId === this.senderId && message.senderId !== this.senderId) {
    // tslint:disable-next-line: max-line-length
      element = '<div class="message-row"><div class="message message-reciever"><p>'  + message.messageContent + '</p></div></div>';
    }

    if (this.messagesContainer === null || this.messagesContainer === 'undefined') {
      this.getContainer();
    }

    if (element != null) {
      if (this.messagesContainer != null) {
        this.messagesContainer.innerHTML += element;
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
      }//  else {
        // console.log('messages container was null');
      // }
    }
    // console.log(this.messengerService.Messages);

  }

  getContainer() {

      this.messagesContainer = document.getElementById('messages-holder');
  }

  onMessage(message) {


    let msgObj: Message;

    try {
      const obj = JSON.parse(message);
      msgObj = obj;
      // console.log(msgObj);
    } catch {
      // console.log('caught exception when parsing');
      return;
    }
    // console.log('message recieved');
    if (msgObj.messageType === 2) {


      if (this.currentContact != null && this.currentContact.id === msgObj.senderId) {
        this.createMessage(msgObj, true);
      } else {
       // console.log('sending notification');
        this.notificationSend.next(msgObj.senderId);
      }

    } else if (msgObj.messageType === 0) {
      // console.log('user connected: ' + msgObj.senderId);
      this.socketConnected.next(msgObj.senderId);
    } else if (msgObj.messageType === 1) {
      // console.log('user disconnected: ' + (+msgObj.messageContent));
      this.socketDisconnected.next(+msgObj.messageContent);
    } else if (msgObj.messageType === 3) {
      // console.log('checking connected users');
      this.getConnectedUsers(msgObj.messageContent);
    }

    this.setMessagesOnRecieved();
  }

  highlight(elementId: string) {
    const contacts = document.getElementsByClassName('messenger-contact');
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < contacts.length; i++) {
      if (contacts[i].classList.contains('contact-selected')) {
        contacts[i].classList.remove('contact-selected');
      }
    }

    const element = document.getElementById(elementId);
    element.classList.add('contact-selected');
  }

  async setCurrentContact(id: number) {
 //   console.log('setting contact: ' + id);
    // console.log('this.messengerService.messages');

    const convContainer = document.getElementById("conversation-container");
    if (convContainer != null && convContainer.classList.contains('container-invisible')) {
      convContainer.classList.remove('container-invisible');
    }


    const obj = { senderId: this.senderId, recieverId: id, messageType: 5, messageContent: ''};
    this.messengerService.send(obj);

    this.getContainer();
    this.workers.forEach(worker => {
      if (worker.id === id) {
        this.currentContact = worker;
        this.setMessagesOnRecieved();
        }
    });
  }

  setMessagesOnRecieved() {
    if (this.messagesContainer === null) {
      this.getContainer();
      if (this.messagesContainer === null) {
        return;
      }
    }
    this.messagesContainer.innerHTML = '';
    this.messengerService.Messages.forEach(message => {
      if (message.senderId === this.currentContact.id && message.senderId !== this.senderId) {
        this.createMessage(message, true);
      } else if (message.senderId === this.senderId && message.recieverId === this.currentContact.id) {
        this.createMessage(message, false);
      }});
  }



  getConnectedUsers(message: string) {
    const connectedUsers = JSON.parse(message);
    if (connectedUsers != null) {
      connectedUsers.forEach(connectedUser => {
        this.socketConnected.next(connectedUser);
      });
    }
  }

  onEnter(event: any) {
    if (event.keyCode === 13) {
      this.send();
    }
  }

  addEmoticon(elementId: string) {
    const element = document.getElementById(elementId);
    const emoticon: string = element.innerHTML;
    const input: any = document.getElementById('send-message-input');
    if (input === null) {
      return;
    }

    input.value += emoticon;
  }

  openEmoticons() {
    const emoticonsContainer: HTMLElement = document.getElementById('emoticons-container');
    if (emoticonsContainer === null) {
      return;
    }

    if (emoticonsContainer.classList.contains('container-invisible')) {
      emoticonsContainer.classList.remove('container-invisible');
    } else {
      emoticonsContainer.classList.add('container-invisible');
    }
  }
}
