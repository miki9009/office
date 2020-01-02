import { Component, OnInit } from '@angular/core';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { WorkerServiceService } from 'src/app/_services/worker-service.service';
import { Worker, WorkerCreate } from 'src/app/_models/worker';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from 'src/app/_services/user.service';
import { ValidationService } from 'src/app/_services/validation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { OfficeService } from 'src/app/_services/Office.service';

@Component({
  selector: 'app-workers-list',
  templateUrl: './workers-list.component.html',
  styleUrls: ['./workers-list.component.css']
})

  // tslint:disable-next-line: member-ordering



export class WorkersListComponent implements OnInit {

  createNewWorker: boolean;
  delete: boolean;
  count: number;
  model: WorkerCreate;
  workers: Worker[];
  workerIndex: number;
  worker: Worker;
  userRoleValue: number;
  comparePassword: string;
  showTask: boolean;
  taskUser: User;

  constructor(private alertify: AlertifyService, private workerService: WorkerServiceService,
              private userService: UserService, public validation: ValidationService,
              private router: Router, private route: ActivatedRoute, private OfficeService: OfficeService) {
  // this.userRoleValue = this.userRole();
  }

  ngOnInit() {
    // tslint:disable-next-line: max-line-length
    this.model = { name: '', surname: '', supervisor: '', checkdIn: false, password: '', email: '', username: '', OfficeID: 0};
    this.userRoleValue = this.userService.userRole();
    if (this.route.url['_value'][0]['path'] === 'main') {
        if (this.userRoleValue !== 0) {
          this.router.navigate(['/workers']);
          return;
        }
    }

    this.workerService.getMyWorkers(this.OfficeService.getOfficeID()).subscribe((data) => {
      this.workers = data;
    });

  }
  showCreatePopup() {
    return this.createNewWorker = !this.createNewWorker;
  }

  createWorker() {
    if (this.workers === null || (typeof this.workers === 'undefined')) {
      this.workers = [];
    }
    this.model.OfficeID = this.OfficeService.getOfficeID();
    this.workerService.createWorker(this.model).subscribe(() => {
    this.alertify.success('Dodano pracownika');
    this.showCreatePopup();
    this.ngOnInit();
    },
    error => {
      this.alertify.error('Nie udało się dodać pracownika');
    });
  }

  refresh(): void {
    window.location.reload();
}

  deleteWorker(id: number) {
    this.workerService.deleteWorker(id).subscribe(() => {
      this.alertify.success('Pracownik usunięty');
      this.ngOnInit();
      },
      error => {
        this.alertify.error('Pracownik dodany');
      });
  }

  deleteWorkerCurrent() {
    this.deleteWorker(this.workerIndex);
    this.delete = false;
  }

  showDeletePopup(id: number) {
    this.workerIndex = id;
    this.delete = !this.delete;
  }

  userID(): number {
    return this.userService.currentUserID();
  }

  editProfile(id: number) {
    // console.log('edit profile: ' + id);
    this.router.navigate(['/profile', id, 0]);
  }

  addTask(userID: number) {
    this.showTask = true;
    this.userService.geTuser(userID).subscribe((data) => {
      this.taskUser = data;
    }, (error) => {
      this.alertify.error(error);
    });
  }

  openTaskPopup(workerID: number) {
    this.workerIndex = workerID;
    this.showTask = true;
  }

  closeTaskPopup() {
    // console.log('closed popup');
    this.showTask = false;
  }



  }
