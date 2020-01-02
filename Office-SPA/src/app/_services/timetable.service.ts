import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class TimetableService {

baseUrl = environment.apiUrl + 'timetable';
daysDisplay: string[] = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

constructor(private http: HttpClient) {

}

createTimeTableRecord(model: TimeTableRecord): Observable<TimeTableRecord> {
  return this.http.post<TimeTableRecord>(this.baseUrl, model);
}

get(userId: number, year: number, month: number ): Observable<TimeTableRecord[]> {

  const heads = new Headers();
  heads.append('Content-Type', 'application/json');
  const params = new HttpParams().set('userId', userId.toString())
  .set('year', year.toString()).set('month', month.toString());
  return this.http.get<TimeTableRecord[]>(this.baseUrl,  {params});
}

getDay(userId: number, year: number, month: number, day: number ): Observable<TimeTableRecord[]> {
  const heads = new Headers();
  heads.append('Content-Type', 'application/json');
  const params = new HttpParams().set('userId', userId.toString())
  .set('year', year.toString()).set('month', month.toString()).set('day', day.toString());
  return this.http.get<TimeTableRecord[]>(this.baseUrl + '/day',  {params});
}

public getDayDisplay(dayIndex: number): string {
  return this.daysDisplay[dayIndex];
}

updateEvent(eventId: number, record: TimeTableRecord): Observable<TimeTableRecord> {
  const params = new HttpParams().set('id', eventId.toString());
  return this.http.put<TimeTableRecord>(this.baseUrl, record, {params});
}

deleteEvent(eventId: number): Observable<TimeTableRecord> {
  const params = new HttpParams().set('id', eventId.toString());
  return this.http.delete<TimeTableRecord>(this.baseUrl,  {params});
}

}
