import { Component, OnInit } from '@angular/core';
import { DaysService } from '../_services/days.service';
import { DayRecord } from '../_models/dayRecord';
import { WorkerServiceService } from '../_services/worker-service.service';
import { TimesheetsService } from '../_services/timesheets.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  constructor(private daysService: DaysService, private workerService: WorkerServiceService) { }

  months: string[] =  ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];

  days: number[];
  monthIndex = 0;
  refresh: number = 1;
  monthDisplay: number;
  yearDisplay: number;
  today: number;
  selectedDays: number[] = [];
  daysToAdd: DayRecord[] = [];
  workerId: number;
  daysElements: HTMLElement[] = [];
  daysSelectedElements: HTMLElement[] = [];
  dropdown: boolean;

  ngOnInit() {
    // clear already assigned days tag
    this.daysElements.forEach(element => {
      element.classList.remove('day-work');
      element.classList.remove('day-work-remote');
      element.classList.remove('day-work-bussiness-trip');
      element.classList.remove('day-work-off-waiting');
      element.classList.remove('day-work-off');
      element.classList.remove('day-work-sick');
    });

    this.daysElements = [];
    this.daysToAdd = [];
    this.prepareDays();
    this.workerId = this.workerService.currentWorkerID();
    this.daysService.getDays(this.workerId.toString(), this.yearDisplay.toString(), this.monthDisplay.toString()).subscribe((data) => {
      this.daysToAdd = [];
      this.colorDays(data);
      // console.log(data);
    });
    this.workerService.clockRefresh.subscribe(() => {
      this.ngOnInit();
    });
  }

  prepareDays() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + this.monthIndex;
    const firstDay = new Date(year, month, 0).getDay();
    const days = new Date(year, month, 0).getDate();
    const lastDay = days + firstDay;
    this.monthDisplay = new Date(year, month).getMonth();
    this.yearDisplay =  new Date(year, month).getFullYear();
    if (year === this.yearDisplay && date.getMonth() === this.monthDisplay) {
      this.today = new Date().getDate();
    } else {
      this.today = -2;
    }
    // console.log('Today: ' + this.today);

    this.days = [];
    let j = 0;
    for (let i = 0; i < 42; i++) {
      if (i < firstDay || i >= lastDay) {
        this.days.push(-1);
      } else {
        j++;
        this.days.push(j);
      }
    }
  }

  monthNext() {
    this.monthIndex++;
    this.clearDaysElements('day-selected');
    this.ngOnInit();
  }

  monthPrevious() {
    this.monthIndex--;
    this.clearDaysElements('day-selected');
    this.ngOnInit();
  }

  select(elementId) {
    const num = +elementId.replace('d', '');
    if (num === null || isNaN(num) || num < 0) {
      return;
    }
    const element = document.getElementById(elementId);
    if (element === null) {
      return;
    }
    const attributes = element.classList;
    const c = 'day-selected';
    let contains = false;
    attributes.forEach(attribute => {
      if (c === attribute) {
        contains = true;
      }
    });
    // console.log(num);
    if (!contains) {
      element.classList.add(c);
      const day = {id : 0, workerId : this.workerId, year : this.yearDisplay, month : this.monthDisplay, day : +num, dayType: 1};
      this.daysToAdd.push(day);
    } else {
      element.classList.remove(c);
      this.daysToAdd.forEach(day => {
        if (day.day === num) {
          this.daysToAdd.splice(this.daysToAdd.indexOf(day));
        }
      });
    }
    console.log(this.daysToAdd.length);
  }

  colorDays(days: DayRecord[]) {
    days.forEach(day => {
      const element = document.getElementById('d' + day.day);
      if (element != null) {
        switch(day.dayType)
        {
          case 1:
              element.classList.add('day-work');
              break;
          case 2:
              element.classList.add('day-work-remote');
              break;
          case 3:
              element.classList.add('day-work-bussiness-trip');
              break;
          case 4:
              element.classList.add('day-work-off-waiting');
              break;
          case 5:
              element.classList.add('day-work-off');
              break;
          case 6:
              element.classList.add('day-work-sick');
              break;
          case 7:
              element.classList.add('day-work-off-demand');
              break;
        }
        this.daysElements.push(element);
      }
    });
  }

  clearDaysElements(className: string) {
    //console.log(this.days);
    for (let i = 0; i < this.days.length; i++) {

      const element = document.getElementById('d' + this.days[i]);
      if (element != null) {
        element.classList.remove(className);
      }

    }
  }

  addDay(dayType: number) {
    this.daysToAdd.forEach(day => {
      day.dayType = dayType;
    });
    this.daysService.addDays(this.daysToAdd).subscribe((data) => {
        this.clearDaysElements('day-selected');
        this.colorDays(this.daysToAdd);
        this.daysToAdd = [];
      });
  }

  dropdownOpen() {
    this.dropdown = true;
  }
}
