import { Component, OnInit,  EventEmitter, Output, Input } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';
import { ValidationService } from '../_services/validation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  comparePassword: string;
  model: any = {};

  constructor(private authService: AuthService, private alertify: AlertifyService, private router: Router,
              public validation: ValidationService) { }

  ngOnInit() {
  }

  register() {
    // this.alertify.warning('Rejestracja została wyłączona, zaloguj się na konto testowe.');
    // return;
    // console.log(this.model);
    this.authService.register(this.model).subscribe(() => {
    this.alertify.success('Rejestracja powiodła się');
    // console.log("Register");
    this.router.navigate(['/home']);
    this.cancel();
    },
    error => {
      this.alertify.error('Błąd rejestracji');
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }



}
