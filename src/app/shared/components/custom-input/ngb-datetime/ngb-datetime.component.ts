import {Component, Input} from '@angular/core';
import { NgbDateAdapter, NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateToStringAdapter } from './ngb-date-to-string-adapter';
import { NgbTimeToStringAdapter } from './ngb-time-to-string-adapter';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';



@Component({
  selector: 'ngbd-datetimepicker',
  templateUrl: './ngb-datetime.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateToStringAdapter },
    { provide: NgbTimeAdapter, useClass: NgbTimeToStringAdapter },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NgbDateTimePicker,
      multi: true
    }
  ],
})
export class NgbDateTimePicker implements ControlValueAccessor{
  onChange: any = () => {};
  onTouch: any = () => {};
  @Input('time') timeInput = true;
  val= "" // this is the updated value that the class accesses
  set value(val){  // this value is updated by programmatic changes if( val !== undefined && this.val !== val){
    this.val = val;
    this.onChange(val);
    this.onTouch(val);
  }

  get value() {
    return this.val;
  }

  // this method sets the value programmatically
  writeValue(value: any){
    this.value = value;
  }
  // upon UI element value changes, this method gets triggered
  registerOnChange(fn: any){
  this.onChange = fn
  }
  // upon touching the element, this method gets triggered
  registerOnTouched(fn: any){
  this.onTouch = fn
  }
}
