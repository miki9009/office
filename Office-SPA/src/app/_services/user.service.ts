import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { JwtHelperService } from '@auth0/angular-jwt';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.apiUrl;

constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {

}

geTusers(): Observable<User[]> {
  return this.http.get<User[]>(this.baseUrl + 'users');
}

geTuser(id: number): Observable<User> {
  return this.http.get<User>(this.baseUrl + 'users/' + id);
}

currentUserID(): number {
  const token = localStorage.getItem('token');
  if (token != null) {
    const dekodedToken = this.jwtHelper.decodeToken(token);
    return +dekodedToken.nameid;
  } else {
    return -1;
  }
}

updateUser(model: any) {
  return this.http.put<User>(this.baseUrl + 'users/' + model.id, model);
}

public userRole(): number {
  const token = localStorage.getItem('token');
  if (token != null) {
    const dekodedToken = this.jwtHelper.decodeToken(token);
    return +dekodedToken.role;
  } else {
    return 3;
  }
}


}
