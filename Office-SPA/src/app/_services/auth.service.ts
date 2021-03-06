import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  baseUrl =  environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  dekodedToken: any;

constructor(private http: HttpClient) { }

login(model: any) {
  return this.http.post(this.baseUrl + 'login', model).pipe(
    map((response: any) => {
      const user = response;
      this.setToken(user);
    })
  );
}

setToken(user: any) {
  if (user) {
    localStorage.setItem('token', user.token);
    this.dekodedToken = this.jwtHelper.decodeToken(user.token);
  }
}

register(model: any) {
  return this.http.post(this.baseUrl + 'register', model);
}

loggedIn() {
  const token = localStorage.getItem('token');
  return !this.jwtHelper.isTokenExpired(token);
}

clockIn(model: any) {
  return this.http.post(this.baseUrl + 'clockin', model).pipe(
    map((response: any) => {
      const user = response;
      // console.log(user);
      this.setToken(user);
    })
  );
}

clockOut(model: any) {
  return this.http.post(this.baseUrl + 'clockout', model);
}

}
