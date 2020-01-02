import {Injectable} from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Worker } from '../_models/worker';
import { WorkerServiceService } from '../_services/worker-service.service';

@Injectable()

export class MemberListResolver implements Resolve<Worker[]> {
    constructor(private userService: WorkerServiceService, private router: Router, private alertify: AlertifyService){}


    resolve(route: ActivatedRouteSnapshot) : Observable<Worker[]>{
        return this.userService.getWorkers().pipe(
            catchError(error => {
                this.alertify.error('Problem retriving data');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}