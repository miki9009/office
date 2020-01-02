import { Component, OnInit } from '@angular/core';
import { OfficeService } from 'src/app/_services/Office.service';
import { OfficeProfile } from 'src/app/_models/OfficeProfile';


@Component({
  selector: 'app-brief-Office',
  templateUrl: './brief-Office.component.html',
  styleUrls: ['../main.component.css']
})
export class BriefOfficeComponent implements OnInit {

  constructor(private OfficeService: OfficeService) { }

  model: OfficeProfile;
  OfficeID: number;

  ngOnInit() {
    this.OfficeID = this.OfficeService.getOfficeID();
    this.OfficeService.getOfficeProfile(this.OfficeID).subscribe((data) => {
      this.model = data;
    });
  }

}
