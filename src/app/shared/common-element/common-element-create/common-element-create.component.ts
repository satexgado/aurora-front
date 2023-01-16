import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonElement } from './../../../express-courrier/shared/models/common-element.model';
import { Helper } from './../../../helpers/helper/helper';
import { Observable } from 'rxjs';
import { BaseCreateComponent } from '../../base-component/base-create.component';

@Component({
  selector: 'app-common-element-create',
  templateUrl: './common-element-create.component.html',
  styleUrls: ['./common-element-create.component.scss'],
})
export class CommonElementCreateComponent
  extends BaseCreateComponent
  implements OnInit
{
  form: FormGroup;
  @Input() loading = false;
  @Input() reset$: Observable<any>;
  @Output() emitted = new EventEmitter<CommonElement>();
  constructor(public fb: FormBuilder, public helper: Helper) {
    super();
  }

  ngOnInit(): void {
    this.form = this.initisaliseForm();

    this.reset$.subscribe(() => {
      this.form = this.initisaliseForm();
    });
  }

  initisaliseForm(element?: CommonElement) {
    return this.fb.group({
      libelle: [element?.libelle, Validators.required],
      description: [element?.description, Validators.required],
    });
  }

  emit() {
    if (this.form.valid) this.emitted.emit(this.form.value);
    else this.helper.notification.alertDanger('Formulaire invalide');
  }
}
