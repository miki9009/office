import { Component, OnInit } from '@angular/core';
import { ValidationService } from 'src/app/_services/validation.service';
import { OfficeProfile } from 'src/app/_models/OfficeProfile';
import { OfficeService } from 'src/app/_services/Office.service';
import { AlertifyService } from 'src/app/_services/alertify.service';


@Component({
  selector: 'app-Office',
  templateUrl: './Office.component.html',
  styleUrls: ['./Office.component.css']
})
export class OfficeComponent implements OnInit {

  model: OfficeProfile;
  constructor(public validation: ValidationService, private OfficeService: OfficeService, private alertify: AlertifyService) { }

  ngOnInit() {
    if (!this.model) {
      this.model = this.newModel();
    }
    this.OfficeService.getOfficeProfile(this.OfficeService.getOfficeID()).subscribe((data) => {
      if (!data) {
        this.model = this.newModel();
      } else {
        this.model = data;
      }
    });
  }

  saveProfile(): void {
    if (!this.validation.checkValidation()) {
      this.alertify.error('Błędnie wypełniony formularz');
      return;
    }
    this.OfficeService.updateOfficeProfile(this.OfficeService.getOfficeID(), this.model).subscribe((data => {
      if (!data) {
        this.model = this.newModel();
      } else {
        this.model = data;
        this.alertify.success('Zmieniono dane profilu');
      }

    }));
  }

  newModel(): OfficeProfile {
    return {id: 0, userId: 0, bankAccount: "", city: "", detailAddress: "", email: "", krs: "",
    mobile: "", nip: "", name: "", phoneNumber: "", postCode: "", regon: "", pesel: ""}

  }

}
