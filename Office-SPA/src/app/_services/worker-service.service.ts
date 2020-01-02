import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { Worker } from '../_models/worker';
import { WorkerDetails } from '../_models/workerDetails';

@Injectable({
  providedIn: 'root'
})
export class WorkerServiceService implements OnDestroy {

constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

baseUrl =  environment.apiUrl  + 'workers';
clockRefresh: EventEmitter<void> = new EventEmitter();


createWorker(model: any) {
  // console.log(model);
  const token = localStorage.getItem('token');
  const decodeToken = this.jwtHelper.decodeToken(token);
  model.userID = decodeToken.nameid;
  // console.log(model);
  return this.http.post(this.baseUrl, model);
}

ngOnDestroy() {
  console.log('on destroy');
}

getWorkers(): Observable<Worker[]> {
  // console.log(this.http.get(this.baseUrl));
  return this.http.get<Worker[]>(this.baseUrl);
}

getMyWorkers(supervisorId: number): Observable<Worker[]> {
  // console.log(this.http.get(this.baseUrl));
  return this.http.get<Worker[]>(this.baseUrl + '/select/' + supervisorId);
}

getWorker(id: number): Observable<Worker> {
  return this.http.get<Worker>(this.baseUrl + '/' + id);
}


deleteWorker(id: number) {

  // const options = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   }),
  // };

  // console.log(this.baseUrl + '/' + id);
  return this.http.delete(this.baseUrl + '/' + id);

}

currentWorkerID(): number {
  const token = localStorage.getItem('token');
  if (token != null) {
    const dekodedToken = this.jwtHelper.decodeToken(token);
    return +dekodedToken.given_name;
  } else {
    return -1;
  }
}

clockIn(id: number) {
  return this.http.get<Worker>(this.baseUrl + '/clockin/' + id);
}

clockOut(id: number) {
  return this.http.get<Worker>(this.baseUrl + '/clockout/' + id);
}

onClockRefresh(): void {
  this.clockRefresh.emit();
}

clockOutBody(model: any) {
  return this.http.put<Worker>(this.baseUrl + '/clockout/' + model.id, model);
}

getWorkerDetails(id: number) {
  return this.http.get<WorkerDetails>(this.baseUrl + '/details/' + id);
}

updateWorkerDetails(model: any) {
  // console.log(this.baseUrl + '/details/' + model.id);
  return this.http.put<WorkerDetails>(this.baseUrl + '/details/' + model.id, model);
}

updateWorker(model: any) {
  // console.log(this.baseUrl + '/' + model.id);
  return this.http.put<Worker>(this.baseUrl + '/' + model.id, model);
}



}



