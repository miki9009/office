import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { WorkerServiceService } from 'src/app/_services/worker-service.service';
import { TaskService } from 'src/app/_services/task.service';
import { Task } from 'src/app/_models/task';
import { OfficeService } from 'src/app/_services/Office.service';
import {Worker} from 'src/app/_models/worker';


@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})

// tslint:disable-next-line: component-class-suffix
// class TaskEdit implements Task {
//   id: number; title: string;
//   description: string;
//   dateAdded: Date;
//   deadline: Date;
//   time: string;
// }

export class TaskEditComponent implements OnInit {

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onClose = new EventEmitter();
  @Input() workerID: number;
  workers: Worker[];
  @Input() task: Task;
  @Input() edit: boolean;

  OfficeID = -1;

  constructor(private workerService: WorkerServiceService, private taskService: TaskService, private OfficeService: OfficeService) {

  }

  ngOnInit() {
    this.OfficeID = this.OfficeService.getOfficeID();

    const date =  new Date();

    this.workerService.getWorkers().subscribe((data) => {
      this.workers = data;
    });

    if (!this.task) {
      this.task = {id: -1, workerId: 0, title: '', description: '', dateAdded: date, time: '12:00:00', orderingPersonId: -1,
      priority: 0, state: 0, deadline: date, OfficeID: this.OfficeID};
    } else {
      this.task.deadline = new Date(this.task.deadline);
    }
  }

  close(): void {
    // console.log('emit');
    this.onClose.emit();
  }

  getTime() {
    const now = new Date();
    // console.log(now.toTimeString());
    return now.toTimeString();
  }

  submit() {
    this.close();
    this.task.workerId = this.workerID;
    this.taskService.addTask(this.task).subscribe((data) => {
      this.task = data;
    });
  }


  changeToInProgress() {
     //this.taskService.updateTask()
  }

}
