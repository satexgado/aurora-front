import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CommonElementCreateComponent } from './../common-element-create/common-element-create.component';
import { Helper } from './../../../helpers/helper/helper';
import { CommonElement } from './../../../express-courrier/shared/models/common-element.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-common-element-edit',
  templateUrl: './common-element-edit.component.html',
  styleUrls: ['./common-element-edit.component.scss'],
})
export class CommonElementEditComponent
  extends CommonElementCreateComponent
  implements OnInit
{
  @Input() element$: Observable<CommonElement>;
  elementSubscription: Subscription;
  constructor(public fb: FormBuilder, public helper: Helper) {
    super(fb, helper);
  }

  ngOnInit(): void {
    this.elementSubscription = this.element$.subscribe((element) => {
      this.form = this.initisaliseForm(element);
    });
  }
}
