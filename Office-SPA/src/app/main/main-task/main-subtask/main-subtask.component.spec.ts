/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MainSubtaskComponent } from './main-subtask.component';

describe('MainSubtaskComponent', () => {
  let component: MainSubtaskComponent;
  let fixture: ComponentFixture<MainSubtaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainSubtaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainSubtaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
