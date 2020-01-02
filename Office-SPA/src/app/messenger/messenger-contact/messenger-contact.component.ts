import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Worker } from 'src/app/_models/worker';
import { Observable } from 'rxjs';
import { WorkerServiceService } from 'src/app/_services/worker-service.service';
import { MessengerService } from 'src/app/_services/messenger.service';


@Component({
  selector: 'app-messenger-contact',
  templateUrl: './messenger-contact.component.html',
  styleUrls: ['./messenger-contact.component.css']
})
export class MessengerContactComponent implements OnInit, OnDestroy {


  @Input() worker: Worker;
  @Output() workerId: EventEmitter<number> = new EventEmitter();
  @Input() events: Observable<number>;
  @Input() notificationEvent: Observable<number>;
  @Input() eventDisconnected: Observable<number>;
  private onWorkerConnected: any;
  private onWorkerDisconnected: any;
  private notificationRecieved: any;
  isConnected: boolean;
  notifiactions = 0;
  currentWorkerId;
  constructor(private workerService: WorkerServiceService, private messengerService: MessengerService) {}

  ngOnInit() {
    this.onWorkerConnected = this.events.subscribe((data) => this.checkConnected(data));
    this.onWorkerDisconnected = this.eventDisconnected.subscribe((data) => this.checkDisconnected(data));
    this.notificationRecieved = this.notificationEvent.subscribe((data) => this.increaseNotification((data)));
    this.currentWorkerId = this.workerService.currentWorkerID();

    this.messengerService.Messages.forEach(message => {
      if (!message.viewed && message.senderId !== this.currentWorkerId) {
        this.increaseNotification(message.senderId);
      }

    });
  }

  ngOnDestroy() {
    this.onWorkerConnected.unsubscribe();
    this.onWorkerDisconnected.unsubscribe();
    this.notificationRecieved.unsubscribe();
  }

  onClick(): void {
    this.notifiactions = 0;
    this.workerId.emit(this.worker.id);
  }

  checkConnected(workerId: number): void {
    if (this.worker === null) {
      return;
    }

    if (workerId === this.worker.id) {
      this.isConnected = true;
    }
  }

  checkDisconnected(workerId: number): void {
    if (this.worker === null) {
      return;
    }
   // console.log('user diconnected');
    if (workerId === this.worker.id) {
      this.isConnected = false;
    }
  }

  increaseNotification(contactId: number) {
    if (contactId === this.worker.id) {
     // console.log('recieved notification');
      this.notifiactions += 1;
      // console.log('notifications for: ' + this.workerId + ' is ' + this.notifiactions);
    }

  }

}


