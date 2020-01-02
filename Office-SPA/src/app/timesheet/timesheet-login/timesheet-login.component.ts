import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { OnInit, Component } from '@angular/core';

@Component({
  selector: 'app-timesheet-login',
  templateUrl: './timesheet-login.component.html',
  styleUrls: ['./timesheet-login.component.css']
})

export class TimesheetLoginComponent implements OnInit {

  model: any = {};

  constructor(
    public authService: AuthService,
    private alertify: AlertifyService,
    private router: Router
  ) {}

  ngOnInit() {}

  login() {
    // console.log(this.model);
    this.authService.login(this.model).subscribe(next => {
        this.alertify.success("Zalogowano pomyślnie");
      },
      error => {
        this.alertify.error(error);
      },
      () => {
        this.router.navigate(['/workers']);
      }
    );
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    localStorage.removeItem("token");
    this.alertify.message("Wylogowano");
    this.router.navigate(['/home']);
  }

  clockIn() {
    // console.log(this.model);
    this.authService.clockIn(this.model).subscribe(next => {
        this.alertify.success('Początek pracy');
      },
      error => {
        this.alertify.error(error);
      },
      () => {
        this.router.navigate(['/workers']);
      }
    );
  }

  clockOut() {
    // console.log(this.model);
    this.authService.clockOut(this.model).subscribe(next => {
        this.alertify.success('Koniec pracy');
      },
      error => {
        this.alertify.error(error);
      },
      () => {
        this.router.navigate(['']);
      }
    );
  }
}
