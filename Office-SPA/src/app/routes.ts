import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MessegesComponent } from './messeges/messeges.component';
import { AuthGuard } from './_guards/auth.guard';
import { WorkersListComponent } from './workers/workers-list/workers-list.component';
import { TimesheetLoginComponent } from './timesheet/timesheet-login/timesheet-login.component';
import { ProfileComponent } from './nav/profile/profile.component';
import { TimesheetMainComponent } from './timesheet/timesheet-main/timesheet-main.component';
import { MainComponent } from './main/main.component';
import { TimetableComponent } from './main/timetable/timetable.component';
import { BriefComponent } from './main/brief/brief.component';
import { OfficeComponent } from './main/Office/Office.component';
import { MainTaskComponent } from './main/main-task/main-task.component';

export const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {
        path: '', //localhost:4200/+''+/[child]
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            // {path: 'members', component: MemberListComponent, canActivate: [AuthGuard], resolve: {users: MemberListResolver}},
            {path: 'workers', component: TimesheetMainComponent, canActivate: [AuthGuard]},
            {path: 'workers-list', component: WorkersListComponent, canActivate: [AuthGuard]},
            {path: 'profile/:id/:role', component: ProfileComponent, canActivate: [AuthGuard]},
            {path: 'timesheet-main', component: WorkersListComponent, canActivate: [AuthGuard]},
            // {path: 'members/:id', component: MemberDetailComponent, canActivate: [AuthGuard], resolve: {user: MemberDetailResolver}},
            {path: 'messages', component: MessegesComponent, canActivate: [AuthGuard]},
            {
              path: 'main',
              component: MainComponent,
              canActivate: [AuthGuard],
              children: [

                {path: '', component: BriefComponent, canActivate: [AuthGuard]},
                {path: 'timetable', component: TimetableComponent, canActivate: [AuthGuard]},
                {path: 'workers-list', component: WorkersListComponent, canActivate: [AuthGuard]},
                {path: 'Office', component: OfficeComponent, canActivate: [AuthGuard]},
                {path: 'main-tasks', component: MainTaskComponent, canActivate: [AuthGuard]},
              ]
            },
        ]
    },


    {path: 'timesheet-login', component: TimesheetLoginComponent},
    {path: '**', component: HomeComponent},

];
