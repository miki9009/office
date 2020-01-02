import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Timesheet } from '../_models/timesheet';
import { JwtHelperService } from '@auth0/angular-jwt';



@Injectable({
  providedIn: 'root'
})
export class TimesheetsService {


  baseUrl = environment.apiUrl + 'timesheets';

constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {

}

getTimesheets(id: number): Observable<Timesheet[]> {
  return this.http.get<Timesheet[]>(this.baseUrl + '/' + id);
}

getCurrentTimesheet(id: number): Observable<Timesheet> {
  return this.http.get<Timesheet>(this.baseUrl + '/current/' + id);
}





}
