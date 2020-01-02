import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

  @Input() show: boolean;
  @Input() title: string;
  @Input() message: any;
  @Output() showChanged = new EventEmitter<boolean>();
  @Output() okPress = new EventEmitter();
  constructor() { }

  ngOnInit() {

  }

  changeShowToFalse() {
    this.show = false;
    this.showChanged.emit(this.show);
    // console.log(this.show);
  }

  okPressed() {
    this.okPress.emit();
  }

  cancelPressed() {
    this.changeShowToFalse();
  }

}
