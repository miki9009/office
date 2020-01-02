import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavComponent } from '../nav/nav.component';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  registerMode = false;
  values: any;

  @Input() navComponent: NavComponent;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router, private userService: UserService) { }

  ngOnInit() {
    if (this.loggedIn()) {
      this.userService.geTuser(this.userService.currentUserID()).subscribe((data) => {
        if (data.userRole === 0) {
          this.router.navigate(['/main']);
        } else {
          this.router.navigate(['/workers']);
        }
      });

    }
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  registerToggle() {
    this.registerMode = true;
  }



  cancelRegisterMode(registerMode: boolean) {
    this.registerMode = registerMode;
  }

  setVisible(elementId: string) {
    const element = document.getElementById(elementId);
    if (element == null) {
      return;
    }
    if (!element.classList.contains('module-description-hidden')) {
      element.classList.add('module-description-hidden');
    } else {
      element.classList.remove('module-description-hidden');
    }
  }

}
