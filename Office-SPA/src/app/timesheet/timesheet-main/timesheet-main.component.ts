import { Component, OnInit, OnDestroy } from '@angular/core';
import { Worker } from 'src/app/_models/worker';
import { WorkerServiceService } from 'src/app/_services/worker-service.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/_models/user';
import { Router } from '@angular/router';
// import { OverlayService } from 'src/app/_services/overlay.service';
import { MessengerService } from 'src/app/_services/messenger.service';


@Component({
  selector: 'app-timesheet-main',
  templateUrl: './timesheet-main.component.html',
  styleUrls: ['./timesheet-main.component.css']
})
export class TimesheetMainComponent implements OnInit, OnDestroy {

  worker: Worker;
  user: User;
  jwtHelper: any;
  showPopup: boolean;
  timesheet: any;
  time: string;
  timer;
  showPanel = 0;

  constructor(private workerService: WorkerServiceService, private alertify: AlertifyService, private userService: UserService,
              private router: Router, private messengerService: MessengerService) {

  }

  ngOnInit() {
    // console.log('workers on init');
    if (this.userService.userRole() === 0) {
      this.router.navigate(['/main']);
      return;
    }
    this.timesheet = new Object();
    this.timesheet.notes = '';
    this.getWorker();
    this.getUser();
    this.setTimer();

  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  getWorker() {
    this.workerService.getWorker(this.workerService.currentWorkerID()).subscribe(data => {
      this.alertify.success('Wczytano dane pracownika');
      this.worker = data;
      this.messengerService.initializeConnection();
      },
      error => {
        this.alertify.error('Nie udało się pobrać danych o pracowniku');
      });
  }

  getUser() {
    this.userService.geTuser(this.userService.currentUserID()).subscribe(data => {
      this.user = data;
      },
      error => {
        this.alertify.error('Nie udało się pobrać danych o użytkowniku');
      });
  }

  clockIn() {
    this.workerService.clockIn(this.workerService.currentWorkerID()).subscribe(data => {
      this.alertify.success('Zaczęto pracę');
      this.worker = data;
      this.workerService.onClockRefresh();
      },
      error => {
        this.alertify.error('Nie udało się rozpocząć pracy');
      });
  }

  clockOut(model: any) {
    model.id = this.workerService.currentWorkerID();
    this.workerService.clockOutBody(model).subscribe(data => {
      this.alertify.success('Zakończono pracę');
      this.worker = data;
      this.workerService.onClockRefresh();
      this.showPopup = false;
      },
      error => {
        this.alertify.error('Nie udało się zakończyć pracy');
      });
  }

  hideBar() {
    const el = document.getElementById('animation-wrapper');
    el.classList.remove('toggled');
  }

  showBar() {
    const el = document.getElementById('animation-wrapper');
    el.classList.add('toggled');
  }

  setTimer(): void {
    this.timer = setInterval(() => {
      this.time = new Date().toLocaleTimeString('pl');
   }, 1000);
  }



  goToPanel(panelID: number) {
    this.showPanel = panelID;
  }
}
