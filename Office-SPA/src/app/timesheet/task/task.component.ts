import { Component, OnInit, Input, Output } from '@angular/core';
import { Task } from 'src/app/_models/task';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @Input() task: Task;
  show: boolean;
  edit: boolean;

 ngOnInit() {

 }

  constructor() { }


}
