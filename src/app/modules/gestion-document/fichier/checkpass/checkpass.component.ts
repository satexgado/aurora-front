import { CacheService } from 'src/app/shared/services';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared';
import { FichierFactory } from 'src/app/core/services/gestion-document/fichier.factory';
import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';

@Component({
  selector: 'app-checkpass-fichier',
  templateUrl: './checkpass.component.html',
})
export class CheckPassFichierComponent   {
  heading = 'classe';
  @Input() fichier: IFichier;
  passwordForm: FormGroup = this.fb.group({
    password: ['', Validators.required],
  });
  @Output() result = new EventEmitter<number | IFichier>();

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
    const service = new FichierFactory();
    service.checkPassword(this.fichier.id, this.passwordForm.controls.password.value).subscribe(
      (data)=> {
        this.result.next(data);
        if(closeModalAfter){
          this.onCloseModal('done');
        }
      }
    )
  }

}
