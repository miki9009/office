import { Component, OnInit } from '@angular/core';
import { TimesheetsService } from 'src/app/_services/timesheets.service';
import { WorkerServiceService } from 'src/app/_services/worker-service.service';
import { Timesheet } from 'src/app/_models/timesheet';
import { Pipe, PipeTransform } from '@angular/core';

// tslint:disable-next-line: use-pipe-transform-interface
@Pipe({ name: 'reverse' })

@Component({
  selector: 'app-timesheet-table',
  templateUrl: './timesheet-table.component.html',
  styleUrls: ['./timesheet-table.component.css']
})
export class TimesheetTableComponent implements OnInit {

  timesheets: Timesheet[];


  constructor(private timesheetService: TimesheetsService, private workerService: WorkerServiceService) {

  }

  ngOnInit() {
      this.rebuildTable();
      this.workerService.clockRefresh.subscribe(() => {
          this.rebuildTable();
      });
    }

    rebuildTable(): void {
      this.timesheetService.getTimesheets(this.workerService.currentWorkerID()).subscribe((data) => {
        const dat = data;
        this.timesheets = dat.slice().reverse();
        this.timesheets.forEach(element => {
          element.startDate = new Date(element.startDate);
          if (element.clockedOut) {
            element.endTime = new Date(element.endTime);
          }
          element.sum = element.total;
        });

        for (let i = this.timesheets.length - 1; i > 0; i--) {
          // if(i > 0) {
          //     console.log(this.timesheets[i].controlSum + ' ' + this.timesheets[i - 1].controlSum);
          // }
          if(i > 0 && this.timesheets[i].controlSum === this.timesheets[i - 1].controlSum) {
            this.timesheets[i - 1].sum = Math.round((this.timesheets[i - 1].sum + this.timesheets[i].sum) * 100) / 100;
          }
        }

      });
    }
}
