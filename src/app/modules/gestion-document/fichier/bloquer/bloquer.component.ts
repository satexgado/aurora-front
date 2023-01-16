import { GedElementFactory } from 'src/app/core/services/gestion-document/ged-element.factory';
import { CacheService } from 'src/app/shared/services';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from 'src/app/shared/validator/confirmed.validator';
import { NotificationService } from 'src/app/shared';
import { FichierFactory } from 'src/app/core/services/gestion-document/fichier.factory';
import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';

@Component({
  selector: 'app-bloquer-fichier',
  templateUrl: './bloquer.component.html',
})
export class BloquerFichierComponent   {
  heading = 'classe';
  @Input() fichier: IFichier;
  passwordForm: FormGroup = this.fb.group({
    password: ['', Validators.required],
    confirmPass: ['', [Validators.required]]
  }, {
    validator: ConfirmedValidator('password', 'confirmPass')
  });
  @Output() newItem = new EventEmitter<IFichier>();

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
    const service = new GedElementFactory();
    service.update({
      password: this.passwordForm.controls.password.value,
      bloquer: 1
    }, this.fichier.id).subscribe(
      (data)=> {
        this.fichier.ged_element = data;
        this.newItem.next(this.fichier);
        if(closeModalAfter){
          this.onCloseModal('done');
        }
      }
    )
  }

}
