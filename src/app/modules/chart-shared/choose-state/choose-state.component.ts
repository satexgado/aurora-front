import { ChooseItem2Component } from 'src/app/modules/choose-item/single2/choose-item2.component';
import { Component, EventEmitter, Output, Input} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { shouldShowRequiredError, isValid, shouldDisableSubmit } from 'src/app/shared/helperfonction';
import { SavedStateFactory } from 'src/app/core/services/saved-state.factory';

@Component({
  selector: 'app-choose-state',
  templateUrl: './choose-state.component.html',
})
export class ChooseStateComponent extends ChooseItem2Component {
  @Output() itemRemove = new EventEmitter<any>();
  @Output() triggerCreateItem = new EventEmitter<any>();
  @Input() canAddItem;
  @Input() set formLibelle(libelle: string) {
    this.addForm.get('libelle').setValue(libelle);
    this.addForm.markAsDirty();
    this.addForm.markAsTouched();
  }
  addForm = new FormGroup({
    libelle: new FormControl('',Validators.required),
  });
  shouldShowRequiredError  = (controlName: string)=> shouldShowRequiredError(this.addForm,controlName);
  isValid = (controlName: string) => isValid(this.addForm,controlName);
  shouldDisableSubmit = () => shouldDisableSubmit(this.addForm);

  onSubmit()
  {
    this.itemCreated.emit(this.addForm.value);
  }

  removeItem(item) {
    this.notificationService.title = 'Suppression';
    this.notificationService.body = 'Êtes-vous sûr(e) de vouloir supprimer cet element? '+item.libelle;

    let confirm = () => {
      this.itemRemove.emit(item)
    };

    let cancel = () => {
    };
    this.notificationService.bodyMaxLength = 300;
    this.notificationService.backdrop =  0;
    this.notificationService.onConfirmation(confirm, cancel);

    this.notificationService.bodyMaxLength = 80;
    this.notificationService.backdrop =  -1;
  }

  addItem() {

  }

  quickUpdate(item, libelle) {
    if(!libelle) {
      item.isUpdating = false;
      return;
    }
    const service = new SavedStateFactory();
    service.update({
      id: item.id,
      libelle: libelle
    }).subscribe(
      ()=>{
        
      }
    );

    item.libelle = libelle;
    item.text = libelle;
    item.isUpdating = false;
  }
}
