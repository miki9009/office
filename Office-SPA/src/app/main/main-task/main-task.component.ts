import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/_services/task.service';
import { OfficeService } from 'src/app/_services/Office.service';
import { Task } from 'src/app/_models/task';

export interface TaskDate {
  day: number;
  month: number;
  year: number;
}

export interface SortedTask {
  taskDate: TaskDate;
  tasks: Task[];
}

@Component({
  selector: 'app-main-task',
  templateUrl: './main-task.component.html',
  styleUrls: ['./main-task.component.css']
})

export class MainTaskComponent implements OnInit {

  constructor(private tasksService: TaskService, private OfficeService: OfficeService) { }

  OfficeId: number;
  tasks: Task[];
  tasksSorted: SortedTask[];

  ngOnInit() {
    this.OfficeId = this.OfficeService.getOfficeID();
    this.tasksService.getAllOfficeTasks(this.OfficeId).subscribe((data) => {
      this.tasks = data;
      this.tasks.forEach(task => {
        task.deadline = new Date(task.deadline);
      });
      this.tasks.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).reverse();
      this.createTasksSorted(this.tasks);
    });
  }

  createTasksSorted(tasks: Task[]) {

    if (!tasks || tasks.length == 0) {
      return;
    }

    let day = 0;
    let month = 0;
    let year = 0;

    this.tasksSorted = [];
    // this.tasksSorted.push({taskDate: {year, month, day}, tasks: []});

    let i = 0;

    while (i < tasks.length) {
      // tslint:disable-next-line: max-line-length
      if (tasks.length > 0 && year === tasks[i].deadline.getFullYear() && month === tasks[i].deadline.getMonth() && day === tasks[i].deadline.getDay()) {

        this.tasksSorted[this.tasksSorted.length - 1].tasks.push(tasks[i]);
        i++;

      } else {
        day = tasks[i].deadline.getDay();
        month = tasks[i].deadline.getMonth();
        year = tasks[i].deadline.getFullYear();
        this.tasksSorted.push({taskDate: {year, month, day}, tasks: []});
      }
    }
    console.log(this.tasksSorted);

  }




}
