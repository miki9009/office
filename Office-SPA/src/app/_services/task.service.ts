import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Task } from '../_models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  baseUrl = environment.apiUrl;

constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {

}


addTask(task: any) {
  console.log(task);
  return this.http.post<Task>(this.baseUrl + 'tasks/', task);
}

getTasks(workerID: number) {
  return this.http.get<Task[]>(this.baseUrl + 'tasks/' + workerID);
}

getAllOfficeTasks(OfficeId: number) {
  return this.http.get<Task[]>(this.baseUrl + 'tasks/all/' + OfficeId);
}

updateTask(task: Task) {
  return this.http.put<Task>(this.baseUrl + 'tasks/' + task.id, task);
}

}
