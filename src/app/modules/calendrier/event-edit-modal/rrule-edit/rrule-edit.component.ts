import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormGroup,  FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Frequency } from 'rrule';


@Component({
  template: ''
})
export class RRuleEditComponent {

  rrule = this.fb.group({
    'freq': [Frequency.DAILY],
    'dtstart': [new Date()],
    'interval': [1],
    'wkst': [],
    'count': [],
    'until': [],
    'bysetpos': [],
    'bymonth': [],
    'bymonthday': [],
    'byyearday': [],
    'byweekno': [],
    'byweekday': [],
  });
  constructor(
    public activeModal: NgbActiveModal,
    public fb: FormBuilder
    ) {}

}
