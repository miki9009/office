import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import {FormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { AlertifyService } from './_services/alertify.service';
import { BsDropdownModule, TabsModule, defineLocale } from 'ngx-bootstrap';
import { MessegesComponent } from './messeges/messeges.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';
import { AuthGuard } from './_guards/auth.guard';
import { UserService } from './_services/user.service';
import { JwtModule } from '@auth0/angular-jwt';
import { TimesheetLoginComponent } from './timesheet/timesheet-login/timesheet-login.component';
import { WorkersListComponent } from './workers/workers-list/workers-list.component';


// Global locales
import { BsDatepickerModule, BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { plLocale } from 'ngx-bootstrap/locale';
import { PopupComponent } from './popup/popup.component';
import { TimesheetMainComponent } from './timesheet/timesheet-main/timesheet-main.component';
import { TimesheetTableComponent } from './timesheet/timesheet-table/timesheet-table.component';
import { ProfileComponent } from './nav/profile/profile.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { TaskTableComponent } from './timesheet/task-table/task-table.component';
import { TaskComponent } from './timesheet/task/task.component';
import { TaskEditComponent } from './timesheet/task-edit/task-edit.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MessengerComponent } from './messenger/messenger.component';
import { MessageComponent } from './messenger/message/message.component';
import { MessengerContactComponent } from './messenger/messenger-contact/messenger-contact.component';
import { InboxComponent } from './messenger/inbox/inbox.component';
import { MainComponent } from './main/main.component';
import { TimetableComponent } from './main/timetable/timetable.component';
import { BriefComponent } from './main/brief/brief.component';
import { OfficeComponent } from './main/Office/Office.component';
import { LoaderService } from './_services/overlay.service';
import { LoaderInterceptor } from './loader.interceptor';
import { BriefOfficeComponent } from './main/brief-Office/brief-Office.component';
import { MainTaskComponent } from './main/main-task/main-task.component';
import { MainSubtaskComponent } from './main/main-task/main-subtask/main-subtask.component';


export function tokenGetter() {
   return localStorage.getItem('token');
}

@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      MessegesComponent,
      WorkersListComponent,
      PopupComponent,
      TimesheetLoginComponent,
      TimesheetMainComponent,
      TimesheetTableComponent,
      ProfileComponent,
      DatepickerComponent,
      TaskTableComponent,
      TaskComponent,
      TaskEditComponent,
      CalendarComponent,
      MessengerComponent,
      MessageComponent,
      MessengerContactComponent,
      InboxComponent,
      MainComponent,
      TimetableComponent,
      BriefComponent,
      OfficeComponent,
      BriefOfficeComponent,
      MainTaskComponent,
      MainSubtaskComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      TabsModule.forRoot(),
      BsDropdownModule.forRoot(),
      RouterModule.forRoot(appRoutes),
      BrowserAnimationsModule,
      BsDatepickerModule.forRoot(),
      JwtModule.forRoot({
        config: {
           tokenGetter: tokenGetter,
           whitelistedDomains: ['eOffice.org.pl', 'localhost:5000'],
           blacklistedRoutes: ['eOffice.org.pl/api/auth', 'localhost:5000/api/auth']
        }
     }),

   ],
   providers: [
      AuthService,
      ErrorInterceptorProvider,
      AlertifyService,
      AuthGuard,
      UserService,
      { provide: LOCALE_ID, useValue: 'pl' },
      LoaderService,
      { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
   ],
   bootstrap: [
      AppComponent
   ],

})

export class AppModule {
   locale = 'pl';
   public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

   constructor(private localeService: BsLocaleService) {
     this.dpConfig.containerClass = 'theme-dark-blue';
     defineLocale('pl', plLocale);
     this.localeService.use('pl');

    // console.log(this.getUsersLocale('pl-PL'));
   }

   getUsersLocale(defaultValue: string): string {
    if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
      return defaultValue;
    }
    const wn = window.navigator as any;
    let lang = wn.languages ? wn.languages[0] : defaultValue;
    lang = lang || wn.language || wn.browserLanguage || wn.userLanguage;
    return lang;
  }
}
