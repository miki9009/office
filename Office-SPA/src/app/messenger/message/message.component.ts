import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_models/message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input() message: Message;
  @Input() senderId: number;
  
  constructor() { }

  ngOnInit() {
  }

}
