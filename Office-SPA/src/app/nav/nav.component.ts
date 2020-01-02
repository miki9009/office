import { Component, OnInit } from "@angular/core";
import { AuthService } from "../_services/auth.service";
import { AlertifyService } from "../_services/alertify.service";
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { MessengerService } from '../_services/messenger.service';

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"]
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(
    public authService: AuthService,
    private alertify: AlertifyService,
    private router: Router,
    private userService: UserService,
    private messengerService: MessengerService
  ) {}

  ngOnInit() {}

  login() {
    // console.log(this.model);
    this.authService.login(this.model).subscribe(next => {
        // this.alertify.success("Zalogowano pomyślnie");
       //  console.log('On Log in');
      },
      error => {
        this.alertify.error(error);
      },
      () => {
        if (this.userService.userRole() === 0) {
          this.router.navigate(['main']);
        } else {
          this.router.navigate(['workers']);
        }
      }
    );
  }

  getRole(): number {
    return this.userService.userRole();
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    this.messengerService.closeConnection();
    localStorage.removeItem("token");
    this.alertify.message("Wylogowano");
    this.router.navigate(['/home']);
  }

  editProfile() {
    this.router.navigate(['/profile', this.userService.currentUserID(), 0]);
  }

  isOwner():boolean {
    return (this.userService.userRole() === 0);
  }


}
