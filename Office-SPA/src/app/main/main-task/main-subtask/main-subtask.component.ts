import { Component, OnInit, Input } from '@angular/core';
import { SortedTask } from '../main-task.component';

@Component({
  selector: 'app-main-subtask',
  templateUrl: './main-subtask.component.html',
  styleUrls: ['../main-task.component.css']
})
export class MainSubtaskComponent implements OnInit {

  constructor() { }

  month = ['STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE', 'LIP', 'SIE', 'WRZ', 'PAŹ', 'LIS', 'GRU']

  @Input() sortedTask: SortedTask;

  ngOnInit() {

  }

  getDateString(date: Date): string {
    return this.sortedTask.taskDate.day + ' ' + this.month[this.sortedTask.taskDate.month] + ' ' + this.sortedTask.taskDate.year;
  }

}
