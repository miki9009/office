import { Injectable, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { User } from '../_models/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { OfficeProfile } from '../_models/OfficeProfile';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfficeService {

constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

baseUrl = environment.apiUrl + 'Office';

user: User;

getOfficeID(): number {
  const token = localStorage.getItem('token');
  if (token != null) {
    const dekodedToken = this.jwtHelper.decodeToken(token);
    return +dekodedToken.groupsid;
  } else {
    return -1;
  }
}

addOfficeProfile(Office: OfficeProfile) {

  return this.http.post<OfficeProfile>(this.baseUrl, Office);
}

updateOfficeProfile(id: number, Office: OfficeProfile): Observable<OfficeProfile> {
  const params = new HttpParams().set('id', id.toString());
  return this.http.put<OfficeProfile>(this.baseUrl, Office, {params});
}

getOfficeProfile(id: number): Observable<OfficeProfile> {
  return this.http.get<OfficeProfile>(this.baseUrl + '/' + id);
}

}
