import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TimetableService } from 'src/app/_services/timetable.service';

@Component({
  selector: 'app-brief',
  templateUrl: './brief.component.html',
  styleUrls: ['../main.component.css']
})
export class BriefComponent implements OnInit {

  dayDisplay: string = '';

  get Router(): Router {
    return this.router;
  }

  timeTableRecords: TimeTableRecord[];

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router,
  private timeTableService: TimetableService) {
}

  ngOnInit() {
    const date = new Date();
    this.dayDisplay = this.getDate(date);
    this.timeTableService.getDay(this.userService.currentUserID(), date.getFullYear(), date.getMonth()+1, date.getDate())
    .subscribe((data) => {
      // this.timeTableRecords = data;

      const workDay = this.isWorkingDay(date);
      this.timeTableRecords = [];

      data.forEach(record => {
        if (record.repeating === 0) {
          this.timeTableRecords.push(record);
        } else  if (record.repeating === 1 || (record.repeating === 2 && workDay)
        || this.isWeekDay(date, record) || this.isMonthDay(date, record)) {
          if (!this.timeTableRecords.includes(record)) {
            this.timeTableRecords.push(record);
          }
        }
      });
      if (this.timeTableRecords.length > 0) {
        this.timeTableRecords.sort((a, b) => parseFloat(a.time.substr(0, 2)) - parseFloat(b.time.substr(0, 2)));
      }
    });
  }

  isWorkingDay(date: Date): boolean {
    const dayOfWeek = date.getDay();
    return !(dayOfWeek === 0 || dayOfWeek === 6);
  }

  isWeekDay(date: Date, record: TimeTableRecord): boolean {
    const dayOfWeek = date.getDay();
    const recordDayOfWeek = new Date(record.year, record.month - 1, record.day).getDay();
    return (dayOfWeek === recordDayOfWeek);

  }

  isMonthDay(date: Date, record: TimeTableRecord): boolean {

    if (!this.isWeekDay(date, record)) {
      return false;
    }

    const dayOfMonth = date.getDate();
    const weekIndex =  Math.floor(dayOfMonth / 7);
    const recordWeekIndex = Math.floor(record.day / 7);
    return weekIndex === recordWeekIndex;
  }

  getDate(date: Date): string {
    const day = date.getDay();
    const dayNum = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return this.timeTableService.getDayDisplay(day) + ', ' + (dayNum < 10 ? '0' + dayNum : dayNum)
     + '.' + (month < 10 ? '0' + month : month) + '.' + year;
  }

  tasksExists(): boolean {
    return this.timeTableRecords && this.timeTableRecords.length > 0;
  }

}
