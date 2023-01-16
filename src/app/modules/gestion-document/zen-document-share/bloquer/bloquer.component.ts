import { GedElementFactory } from 'src/app/core/services/gestion-document/ged-element.factory';
import { Factory } from 'src/app/core/services/factory';
import { CacheService } from 'src/app/shared/services';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from 'src/app/shared/validator/confirmed.validator';
import { NotificationService } from 'src/app/shared';
import { IGedElement } from 'src/app/core/models/gestion-document/ged-element.model';
import { IBase } from 'src/app/core/models/base.interface';

@Component({
  selector: 'app-bloquer',
  templateUrl: './bloquer.component.html',
})
export class BloquerComponent   {
  heading = 'classe';
  @Input() item: IBase;
  passwordForm: FormGroup = this.fb.group({
    password: ['', Validators.required],
    confirmPass: ['', [Validators.required]]
  }, {
    validator: ConfirmedValidator('password', 'confirmPass')
  });
  @Output() newItem = new EventEmitter<IGedElement>();
  @Input() service: Factory<IGedElement> = new GedElementFactory();
  is_loading;

  constructor(
    protected fb: FormBuilder,
    protected cacheService: CacheService,
    protected notification: NotificationService,
    protected activeModal: NgbActiveModal)
  {
  }

  shouldShowRequiredError( controlName: string) {
    const control = this.passwordForm.get(controlName);
    if (control) {
      return (control.dirty || control.touched) && control.hasError('required');
    }
  }

  hasError( field: string, error: string ) {
    const control = this.passwordForm.get(field);
    return control.dirty && control.hasError(error);
  }

  isValid( controlName: string) {
    const control = this.passwordForm.get(controlName);
    if (control) {
      return control.valid;
    }
  }

  getValue( controlName: string) {
    const control = this.passwordForm.get(controlName);
    if (control) {
      return control.value;
    }
    return false;
  }

  shouldDisableSubmit() {
    return ( this.passwordForm.valid && !(this.passwordForm.dirty || this.passwordForm.touched) ) || this.passwordForm.invalid;
  }



  onCloseModal(raison) {
    this.activeModal.close(raison);
  }

  onSubmit(closeModalAfter = true) {
    this.is_loading =true;
    this.service.update({
      password: this.passwordForm.controls.password.value,
      bloquer: 1
    }, this.item.id).subscribe(
      (data)=> {
        this.is_loading =false;
        this.newItem.next(data);
        if(closeModalAfter){
          this.onCloseModal('done');
        }
      },
      ()=> {

      }
    )
  }

}
