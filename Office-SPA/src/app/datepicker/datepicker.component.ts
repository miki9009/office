import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { plLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})

export class DatepickerComponent implements OnInit {

  data: Date;

  dateChanged() {
    const element: any = document.getElementById("date-picker-date");
    this.data = element.value;
    // console.log(this.data);
  }

  locale = 'pl';
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  constructor(private localeService: BsLocaleService) {
    this.dpConfig.containerClass = 'theme-dark-blue';
    defineLocale('pl', plLocale);
    this.localeService.use('pl');
  }

  ngOnInit() {

  }

}
