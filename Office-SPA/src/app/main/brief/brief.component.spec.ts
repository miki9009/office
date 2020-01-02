/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BriefComponent } from './brief.component';

describe('BriefComponent', () => {
  let component: BriefComponent;
  let fixture: ComponentFixture<BriefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BriefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BriefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
