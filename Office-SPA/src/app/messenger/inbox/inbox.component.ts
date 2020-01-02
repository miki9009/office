import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessengerService } from 'src/app/_services/messenger.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit, OnDestroy {

  norificationSubscription: any;
  messengerStateChangedSubscription: any;
  notifications = 0;

  constructor(private messengerService: MessengerService) {

  }

  ngOnInit() {
    // console.log('notification init');

    this.norificationSubscription = this.messengerService.recieved.subscribe((data) => {
      if (!this.messengerService.MessengerActive) {
        const msg = JSON.parse(data);
        // console.log(msg);
        const hasViewedProperty = msg.hasOwnProperty('viewed');
        if (hasViewedProperty) {
          if (!msg.viewed && (msg.messageType === 2)) {

            this.notifications++;
          } else if (msg.messageType === 4) {
            const messageContent = JSON.parse(msg.messageContent);
            if (messageContent.length > 0) {
              this.notifications++;
            }
          }
        }

      }
    });

    this.messengerStateChangedSubscription = this.messengerService.messengerStateChanged.subscribe((data) => {
      if (data === true) {
        this.notifications = 0;
      }
    });
  }

  ngOnDestroy() {
    this.norificationSubscription.unsubscribe();
    this.messengerStateChangedSubscription.unsubscribe();
  }

}
