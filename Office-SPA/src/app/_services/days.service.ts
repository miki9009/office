import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DayRecord } from '../_models/dayRecord';

@Injectable({
  providedIn: 'root'
})
export class DaysService {

  baseUrl = environment.apiUrl;

constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {

}

addDays(days: any) {
  // console.log(this.baseUrl + 'days');
  // console.log(days);
  //const dayModels : DayRecord[] = days;
  //console.log(dayModels);
  return this.http.post<DayRecord[]>(this.baseUrl + 'days', days);
}

getDays(workerID: string, year: string, month: string) {
  const heads = new Headers();
  heads.append('Content-Type', 'application/json');
  const params = new HttpParams().set('id', workerID).set('year', year).set('month', month);
  // console.log(this.baseUrl + 'days',  {params});
  return this.http.get<DayRecord[]>(this.baseUrl + 'days',  {params});
}

updateDay(dayRecord: DayRecord) {
  return this.http.put<DayRecord>(this.baseUrl + 'days/' + dayRecord.id, dayRecord);
}
}
