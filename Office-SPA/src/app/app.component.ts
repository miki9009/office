import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import { Router, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import { LoaderService } from './_services/overlay.service';
//import { OverlayService } from './_services/overlay.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

  jwtHelper = new JwtHelperService();
  loading: boolean;
  isLoaded: boolean;

  constructor(private authService: AuthService, private router: Router, private loaderService: LoaderService){}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.dekodedToken = this.jwtHelper.decodeToken(token);
    }
    this.loaderService.hideOverlay();
  }

  public get IsLoading(){
    return this.loaderService.isLoading;
  }





}
