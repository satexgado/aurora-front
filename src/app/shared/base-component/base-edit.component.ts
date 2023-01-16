import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BaseCreateComponent } from './base-create.component';
import { BaseService } from '../services/base.service';

@Component({
  selector: '',
  template: '',
  styles: [],
})
export class BaseEditComponent extends BaseCreateComponent implements OnInit {
  single: any;

  constructor(protected service1: BaseService) {
    super(service1);
  }

  ngOnInit() {
    // super.ngOnInit();

    this.subscriptions['_single'] = this.service.singleData$.subscribe(
      (single) => (this.single = single)
    );
  }

  initFormWithData(
    data: any,
    requiredField: string[] = [],
    ignoreField: string[] = [],
    callback?: Function
  ) {
    this.form = this.fb.group({});
    Object.keys(data).forEach((key, index) => {
      if (!ignoreField.includes(key)) {
        if (requiredField.includes(key)) {
          this.form.addControl(
            key,
            new FormControl(data[key], Validators.required)
          );
        } else {
          this.form.addControl(key, new FormControl(data[key]));
        }
      }
    });
    if (callback) {
      callback();
    }

    this.isFormOk = true;
  }
}
