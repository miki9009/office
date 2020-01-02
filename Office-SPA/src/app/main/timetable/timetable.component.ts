import { Component, OnInit, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { TimetableService } from 'src/app/_services/timetable.service';
import { UserService } from 'src/app/_services/user.service';
import { WorkerServiceService } from 'src/app/_services/worker-service.service';


@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css'],
  encapsulation: ViewEncapsulation.None,

})


export class TimetableComponent implements OnInit, AfterViewChecked{

  hours: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  daysLength: number[] = [0, 1, 2, 3, 4, 5, 6];
  monthsLength: number[] = [0, 1, 2, 3, 4, 5];
  months: string[] =  ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];

  cookieView = 'VIEW';
  view = 0;
  previousView = 0;
  showViewList = false;
  daysInMonth: number;

  days: number[];
  monthIndex = 0;
  monthDisplay: number;
  yearDisplay: number;
  today: number;
  todayElement: any;
  currentDate: Date;

  currentDayIndex: number;
  lastDay: number;
  dayOfWeek = 0;

  weekIndex = 1;
  showPopup = false;
  taskToday = '?';
  taskTime = '?';
  dayHtmlElements: HTMLElement[] = [];
  monthHtmlElements: HTMLElement[] = [];
  editMode = false;
  workers: string[];

  repetitionModel = {day: 0, weekIndex: 0}

  OpenDayButton: HTMLElement;

  // tslint:disable-next-line: max-line-length
  model: TimeTableRecord = {id: 0, userId: 0, title: '', description: '', year: 2000, month: 0, day: 0,  time: '', repeating: 0, usersAttached: 'wybierz'};
  timetableRecords: TimeTableRecord[] = [];

  constructor(private timetableService: TimetableService, private userService: UserService, private workerService: WorkerServiceService) {

  }

  ngOnInit() {
    this.view = this.getView();
    const date = new Date();
    const hours = date.getHours();
    this.taskTime = (hours < 10 ? '0' + hours : hours) + ':00';

    const day = date.getDay();
    this.dayOfWeek = day;
    const month = date.getMonth();
    this.taskToday = (day < 10 ? '0' + day : day) + '.' + (month < 10 ? '0' + month : month) + '.' + date.getFullYear();

    this.prepareDays();
    this.currentDayIndex = this.today;

    this.workers = [];
    this.workerService.getWorkers().subscribe((data) => {
      data.forEach(worker => {
        this.workers.push(worker.name + ' ' + worker.surname);
      });
    });
  }



  ngAfterViewChecked(): void {
    if (this.previousView !== this.view) {
      this.previousView = this.view;
      this.refreshView();
    }
  }

  refreshView() {
    // This should be refreshed less times
    this.monthRefreshToday();
    if (this.view === 0) {
      this.refreshDayLabel();
    }
    this.refreshAccordingToView(this.view);
  }


  clickList(elementId): void {
    const element: HTMLElement = document.getElementById(elementId);
    this.showViewList = !this.showViewList;
    if (this.showViewList) {
      if (!element.classList.contains('show')) {
        element.classList.add('show');
      }
    } else {
      if (element.classList.contains('show')) {
        element.classList.remove('show');
      }
    }
  }

  changeView(view: number): void {
    this.view = view;
    localStorage.setItem(this.cookieView, view.toString());
  }

  getView(): number {
    const val: number = +localStorage.getItem(this.cookieView);
    if (val) {
      return val;
    } else {
      return 0;
    }
  }

  prepareDays() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + this.monthIndex;
    const firstDay = new Date(year, month, 0).getDay();
    this.daysInMonth = new Date(year, month + 1, 0).getDate();

    this.lastDay = this.daysInMonth + firstDay;
    this.currentDate = new Date(year, month);
    this.monthDisplay = this.currentDate.getMonth();
    this.yearDisplay =  this.currentDate.getFullYear();
    if (year === this.yearDisplay && date.getMonth() === this.monthDisplay) {
      this.today = new Date().getDate();
    } else {
      this.today = -2;
    }

    this.days = [];
    let j = 0;
    for (let i = 0; i < 42; i++) {
      if (i < firstDay || i >= this.lastDay) {
        this.days.push(-1);
      } else {
        j++;
        this.days.push(j);
      }
    }

    this.currentDayIndex = 1;
    this.refreshMonthLabel();

    this.timetableService.get(this.userService.currentUserID(), this.yearDisplay,
    (this.monthDisplay + 1)).subscribe((data) => {
      this.timetableRecords = data;
      this.CreateRepetition(this.timetableRecords);
      this.timetableRecords.sort((a, b) => parseFloat(a.time.substr(0, 2)) - parseFloat(b.time.substr(0, 2)));
      this.refreshView();
    });
  }

  CreateRepetition(records: TimeTableRecord[]): void {

    this.timetableRecords.forEach(record => {
      if (+record.repeating === 1) {
        this.days.forEach(day => {
          if (day < 1) { // DAILY
            return;
          }
          // fracture added to duplicates, it is removed when updating
          const newRecord = {id: record.id + (day / 100), userId: record.userId, title: record.title, description: record.description,
          year: record.year, month: record.month, day,  time: record.time, repeating: record.repeating, usersAttached: record.usersAttached};
          this.timetableRecords.push(newRecord);
        });
      } else if (+record.repeating === 2) {

        this.days.forEach(day => {
          if (day < 1) { // WEEK DAYS
            return;
          }
          const dayofWeek = new Date(record.year, record.month - 1, this.days.indexOf(day)).getDay();

          if (dayofWeek !== 2 && dayofWeek !== 3) {
          // fracture added to duplicates, it is removed when updating
          const newRecord = {id: record.id + (day / 100), userId: record.userId, title: record.title, description: record.description,
            year: record.year, month: record.month, day,  time: record.time, repeating: record.repeating, usersAttached: record.usersAttached};
          this.timetableRecords.push(newRecord);
          }

        });

      } else if (+record.repeating === 3) { // MONTHLY
        let firstDayIndex: number = new Date(record.year, record.month - 1, record.day).getDay() - 1;
        if (firstDayIndex === -1) {
          firstDayIndex = 6;
        }
        let weekIndex: number = 0;

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.days.length; i++) {
          if (i === (firstDayIndex + (weekIndex * 7))) {
            // fracture added to duplicates, it is removed when updating
            if (this.days[i] > 0) {
              // tslint:disable-next-line: max-line-length
              const newRecord = {id: record.id + (this.days[i] / 100), userId: record.userId, title: record.title, description: record.description,
                year: record.year, month: record.month, day: this.days[i],  time: record.time, repeating: record.repeating,
                usersAttached: record.usersAttached};
              this.timetableRecords.push(newRecord);
            }
            weekIndex++;
            }
        }
      } else if (+record.repeating === 4) { // MONTHLY

        const date = new Date(record.year, record.month - 1, record.day);

        let dayIndex: number = date.getDay() - 1;
        const dayOfMonth: number = date.getDate();
        let weekIndex: number = Math.floor(dayOfMonth / 7);

        let firstDay = 0;
        let temp = dayIndex;
        while(this.days[temp] === -1) {
          firstDay++;
          temp += 7;
        }

        weekIndex += firstDay;

        if (dayIndex === -1) {
          dayIndex = 6;
        }
        let sum = ((weekIndex * 7) + dayIndex);

        if (this.days[sum] === -1) {
          if (sum < 15) {
            while (this.days[sum] === -1 && sum < 21) {
              sum += 7;
            }
          } else {
            while (this.days[sum] === -1 && sum > 15) {
              sum -= 7;
            }
          }
        }
        // tslint:disable-next-line: align
        if (this.days[sum] !== -1) {
          record.day = this.days[sum];
        }
      }
    });

    // Remove all original repetitions leaving only clones (original has integer id)
    let clear = true;
    while (clear) {
      clear = false;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.timetableRecords.length; i++) {
        if ((+this.timetableRecords[i].repeating === 3 || +this.timetableRecords[i].repeating === 2
          || +this.timetableRecords[i].repeating === 1) && Number.isInteger(this.timetableRecords[i].id)) {
          this.timetableRecords.splice(this.timetableRecords.indexOf(this.timetableRecords[i]), 1);
          clear = true;
        }
      }
    }
  }

  refreshAccordingToView(view: number) {
    if (!this.timetableRecords) {
      return;
    }
    if (view === 0) {
      this.refreshDayRecords();
    } else if (view === 1) {
      this.refreshMonthRecords();
    }
  }

  refreshMonthRecords() {

    this.monthHtmlElements.forEach(element => {
      element.innerHTML = '';
    });

    this.monthHtmlElements = [];

    this.timetableRecords.forEach(record => {
        const element = document.getElementById('day-cell-inner-' + record.day);
        this.monthHtmlElements.push(element);
        // tslint:disable-next-line: max-line-length
        // tslint:disable-next-line: no-unused-expression
        // tslint:disable-next-line: max-line-length
        const dayRecord = '<div class="day-record" id="record-' + record.id + '"><div</div><div class="day-record-hour">'
        + record.time + '</div><strong>' + record.title + '</strong></div>';

        element.innerHTML += dayRecord;
    });
    const component = this;
    this.timetableRecords.forEach(record => {
      const element = document.getElementById('record-' + record.id);
      const func = this.editTask.bind(this, this.timetableRecords.indexOf(record), component);
      element.removeEventListener('click', func);
      element.addEventListener('click', func);
    });

  }

  refreshDayRecords() {
    this.dayHtmlElements.forEach(element => {
      element.innerHTML = '';
    });
    this.dayHtmlElements = [];

    this.timetableRecords.forEach(record => {

      if (record.day === this.currentDayIndex) {
        const hour = record.time.split(':')[0];
        const element = document.getElementById('hour-' + hour);
        this.dayHtmlElements.push(element);
        element.innerHTML += '<div class="single-day-record" id="record-' +record.id + '"><div class="day-record-circle"></div><div class="day-record-hour">'
         + record.time + '</div><strong>' + record.title + '</strong><div style="display:inline"><i> - ' + record.description + '</i></div></div>';
      }
    });
    const component = this;
    this.timetableRecords.forEach(record => {
      if (record.day === this.currentDayIndex) {
      // console.log('added');
      const element = document.getElementById('record-' + record.id);
      const func = this.editTask.bind(this, this.timetableRecords.indexOf(record), component);
      element.removeEventListener('click', func);
      element.addEventListener('click', func);
      }
    });
  }

  // MOTNH
  monthNext(): void {
    this.monthIndex++;
    this.prepareDays();
  }

  monthPrevious(): void {
    this.monthIndex--;
    this.prepareDays();
  }

  refreshMonthLabel(): void {
    document.getElementById('month-label').innerHTML = this.months[this.monthDisplay] + ' ' + this.yearDisplay;
  }

  monthRefreshToday(): void {

    if (this.todayElement && this.todayElement.classList.contains('month-today')) {
      this.todayElement.classList.remove('month-today');
    }

    if (this.today === -2) {
      return;
    }

    if (this.todayElement != null && this.todayElement.classList.contains('month-today')) {
      this.todayElement.classList.remove('month-today');
    }

    this.todayElement = document.getElementById('day-cell-' + this.today);

    if (this.todayElement != null) {
        this.todayElement.classList.add('month-today');
    }
  }

  // DAY
  dayNext(): void {

    let dateNew = new Date(this.yearDisplay, this.monthDisplay, this.currentDayIndex);
    const daysInMonth = new Date(dateNew.getFullYear(), dateNew.getMonth() + 1, 0).getDate();

    if (this.currentDayIndex >= daysInMonth) {
      this.currentDayIndex = 1;
      this.monthIndex++;
      this.prepareDays();
    } else {
      this.currentDayIndex++;
    }
    dateNew = new Date(this.yearDisplay, this.monthDisplay, this.currentDayIndex);
    this.dayOfWeek = dateNew.getDay();
    this.refreshDayLabel();
    this.refreshView();
  }

  dayPrevious(): void {
    let dateNew = new Date(this.yearDisplay, this.monthDisplay, this.currentDayIndex);

    if (this.currentDayIndex > 1) {
      this.currentDayIndex--;
    } else {
      const daysInMonthPrevious = new Date(dateNew.getFullYear(), dateNew.getMonth(), 0).getDate();
      this.monthIndex--;
      this.prepareDays();
      this.currentDayIndex = daysInMonthPrevious;
    }
    dateNew = new Date(this.yearDisplay, this.monthDisplay, this.currentDayIndex);
    this.dayOfWeek = dateNew.getDay();
    this.refreshDayLabel();
    this.refreshView();
  }

  refreshDayLabel(): void {
    const element = document.getElementById('day-label');
    if (element != null) {
      const d = (this.currentDayIndex);
      const m = (this.monthDisplay + 1);
      element.innerHTML = (d < 10 ? '0' + d : d) + '.' + (m < 10 ? '0' + m : m)  + '.' + this.yearDisplay + '<p><strong>'
      + this.timetableService.getDayDisplay(this.dayOfWeek) + '</strong></p>';
    }
  }


  get Today(): string {
    return this.taskToday;
  }


  get Time(): string {
    return this.taskTime;
  }

  setPopup(val: boolean) {
    this.showPopup = val;
    if (!val) {
      this.editMode = false;
    }
  }

  createNewTask(year: number, month: number, day: number, hours: number = 12) {
    if (this.editMode) {
      return;
    }
    this.repetitionModel.day = 0;
    this.repetitionModel.weekIndex = 0;
    this.model.repeating = 0;
    this.model.description = '';
    this.model.title = '';
    this.taskToday = (day < 10 ? '0' + day : day) + '.' + (month < 10 ? '0' + month : month) + '.' + year;
    this.taskTime = (hours < 10 ? '0' + hours : hours) + ':00';
    this.model.time = this.Time;
    this.model.month = month;
    this.model.year = year;
    this.model.day = day;
    this.model.userId = this.userService.currentUserID();
    this.setPopup(true);
  }

  editTask(taskIndex: number, component: TimetableComponent): void {
    if (!component.timetableRecords || taskIndex < 0 || taskIndex >= component.timetableRecords.length) {
      return;
    }
    component.editMode = true;
    component.model = component.timetableRecords[taskIndex];
    const repeating: number = +component.model.repeating;
    if (repeating === 3 || repeating === 4) {
      const date = new Date(component.yearDisplay, component.monthDisplay, component.model.day);
      const dayIndex = date.getDay();
      this.repetitionModel.day = dayIndex === 0 ? 6 : dayIndex - 1 ;
      if (repeating === 4) {
        this.repetitionModel.weekIndex = Math.floor(date.getDate() / 7);
      }
    }
    const m = component.model;
    component.taskToday = ( m.day < 10 ? '0' + m.day : m.day) + '.' + (m.month < 10 ? '0' + m.month : m.month) + '.' + m.year;
    this.setPopup(true);
  }

  saveTask() {
    this.refreshModelRepetition();

    if (this.model.time.length > 4) {
      this.model.time = this.model.time.substr(0, 5);
    }
    this.model.id = Math.floor(this.model.id);
    this.timetableService.updateEvent(this.model.id, this.model).subscribe((data) => {
      for (let i = 0; i < this.timetableRecords.length; i++) {
        if (this.timetableRecords[i].id === data.id) {
          this.timetableRecords[i] = data;
        }
      }
      this.prepareDays();
    });
    this.setPopup(false);
  }

  deleteTask(eventId: number) {
    eventId = Math.floor(eventId);
    this.timetableService.deleteEvent(eventId).subscribe((data) => {

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.timetableRecords.length; i++) {
        if (this.timetableRecords[i].id === data.id) {
          this.timetableRecords.splice(i, 1);
        }
      }
      this.prepareDays();
    });
    this.setPopup(false);
  }

  refreshModelRepetition() {
    if (+this.model.repeating === 4) {
      this.model.day = this.getRepetitionDate();
    } else if (+this.model.repeating === 3) {
      this.model.day = this.getRepetitionDay();
    }
  }

  addTask(): void {

    this.refreshModelRepetition();
    this.model.time = this.model.time.substr(0, 5);
    this.model.id = Math.floor(this.model.id);

    this.timetableService.createTimeTableRecord(this.model).subscribe((data) => {
      const lastDayIndex = this.currentDayIndex;
      this.prepareDays();
      this.currentDayIndex = lastDayIndex;
    });
    this.setPopup(false);
  }

  getRepetitionDate(): number {
    let day = 1;
    const dayIndex = +this.repetitionModel.day;
    const weekIndex = +this.repetitionModel.weekIndex;
    let blankIndex = 0;

    while (this.days[dayIndex + (blankIndex * 7)] === -1) {
      blankIndex++;
    }
    day = this.days[dayIndex + ((blankIndex + weekIndex) * 7)];
    return day;
  }

  getRepetitionDay(): number {
    return this.days[+this.repetitionModel.day + (2 * 7)];
  }

  showOpenDayButton(elementId: string) {
    this.hideOpenDayButton();
    this.OpenDayButton = document.getElementById(elementId);
    if (this.OpenDayButton) {
      this.OpenDayButton.classList.add('day-open-visible');
    }
  }

  hideOpenDayButton() {
    if (this.OpenDayButton) {
      this.OpenDayButton.classList.remove('day-open-visible');
      this.OpenDayButton = null;
    }
  }

  openDay(dayIndex: number) {
    this.currentDayIndex = dayIndex;
    this.changeView(0);
  }



}

