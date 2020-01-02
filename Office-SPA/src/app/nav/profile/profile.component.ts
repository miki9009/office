import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { WorkerServiceService } from 'src/app/_services/worker-service.service';
import { Worker } from 'src/app/_models/worker';
import { UserService } from 'src/app/_services/user.service';
import { WorkerDetails } from 'src/app/_models/workerDetails';
import { ValidationService } from 'src/app/_services/validation.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;
  worker: Worker;
  workerDetails: WorkerDetails;
  userID: number;
  elements = [];
  role: number;

  constructor(private workerService: WorkerServiceService, private userService: UserService, public validation: ValidationService,
              private route: ActivatedRoute, private router: Router, private jwtHelper: JwtHelperService) { }

  ngOnInit() {
    this.userService.geTuser(this.userService.currentUserID()).subscribe((data) => {

    const profileUserId: number = +this.route.snapshot.paramMap.get('id');

    if (data.userRole === 3 && data.id !== profileUserId) {
      this.router.navigate(['/home']);
    }

    this.userService.geTuser(profileUserId).subscribe((d0) => {
      this.user = d0;
      if (this.user.workerID < 1) {
        return;
      }
      this.workerService.getWorker(this.user.workerID).subscribe((d1) => {
        this.worker = d1;
        // if (this.worker.id !== this.workerService.currentWorkerID()) {
        //   this.router.navigate(['/home']);
        // }
        this.workerService.getWorkerDetails(this.worker.id).subscribe((d2) => {
          this.workerDetails = d2;
        });
      });
    });
  });
    const token = localStorage.getItem('token');
    const dekodedToken = this.jwtHelper.decodeToken(token);
    this.role = +dekodedToken.role;
  }

  updateWorkerDetails(model: any) {
    this.workerService.updateWorkerDetails(model).subscribe((data) => {
      this.workerDetails = data;
    });
  }

  updateWorker(model: any) {
    this.workerService.updateWorker(model).subscribe((data) => {
      this.worker = data;
    });
  }

  updateUser(model: any) {
    this.userService.updateUser(model).subscribe((data) => {
      this.user = data;
    });
  }

  changeToActive(elementID) {
    // tslint:disable-next-line: prefer-for-of
    //console.log(this.elements);
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].disabled = true;
    // tslint:disable-next-line: no-trailing-whitespace
    }
    this.elements = [];
    const element = document.getElementById(elementID);
    if (element === null) {
      return;
    }
    element.removeAttribute('disabled');
    this.elements.push(element);
  }

  saveChanges() {
    // console.log(this.user);
    // console.log(this.worker);
    // console.log(this.workerDetails);
    this.changeToActive('none');
    this.updateUser(this.user);
    this.updateWorker(this.worker);
    this.updateWorkerDetails(this.workerDetails);
  }

  back() {
    this.router.navigate(['/home']);
  }
}
