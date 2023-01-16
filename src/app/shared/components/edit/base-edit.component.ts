import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService } from 'src/app/shared/services/helper.service';
import { AppInjector } from '../../services';
import { NotificationService } from '../../notification';
import { ApiResource } from '../../interfaces';

@Component({
  template: '',
})
export class BaseEditComponent implements OnInit {
  @Input() title = '';
  editForm: FormGroup;
  isLoading = false;
  @Output() newItem = new EventEmitter<any>();
  @Input() item: any;
  @Input() isUpdating = false;
  protected helper: HelperService;
  protected formBuilder: FormBuilder;
  protected crudService: ApiResource;
  protected notificationService: NotificationService;

  constructor(
    crudService: ApiResource,
    protected cdRef: ChangeDetectorRef,
    public activeModal: NgbActiveModal
  ) {
    this.crudService = crudService;

    const injector = AppInjector.getInjector();
    this.helper = injector.get(HelperService);
    this.formBuilder = injector.get(FormBuilder);
    this.notificationService = injector.get(NotificationService);
  }

  ngOnInit() {
    if (!this.item) {
      return this.notificationService.onInfo(
        'Aucune donnée fournis au formulaire'
      );
    }
    this.editForm = this.createFormGroup(this.item);
    this.cdRef.detectChanges();
  }

  createFormGroup(item: any): FormGroup {
    return this.formBuilder.group(item);
  }

  shouldShowRequiredError(controlName: string) {
    const control = this.editForm.get(controlName);
    if (control) {
      return (control.dirty || control.touched) && control.hasError('required');
    }
  }

  hasError(field: string, error: string) {
    const control = this.editForm.get(field);
    return control.dirty && control.hasError(error);
  }

  isValid(controlName: string) {
    const control = this.editForm.get(controlName);
    if (control) {
      return control.valid;
    }
  }

  getValue(controlName: string) {
    const control = this.editForm.get(controlName);
    if (control) {
      return control.value;
    }
    return false;
  }

  shouldDisableSubmit() {
    return (
      this.isLoading ||
      (this.editForm.valid &&
        !(this.editForm.dirty || this.editForm.touched)) ||
      this.editForm.invalid
    );
  }

  doUpdateItem(closeModalAfter: boolean = true) {
    // return only dirty controller values as array except id
    const updatedFields = this.helper.getDirtyState(
      this.editForm,
      new Set(['id'])
    );

    if (Object.keys(updatedFields).length) {
      return this.crudService.update(updatedFields).subscribe(
        (data) => {
          this.newItem.emit(data);
          this.isLoading = false;
          this.editForm.markAsPristine();
          this.editForm.markAsUntouched();
          this.notificationService.onSuccess(
            'Toutes les modifications ont été enregistré'
          );
          if (closeModalAfter) {
            this.onCloseModal('done');
          }
          this.isLoading = false;
        },
        (error) => {
          if (error.status == 500) {
            this.notificationService.onError(
              "Impossible d'éffectuer cette requête"
            );
          }
          this.isLoading = false;
        }
      );
    }
  }

  doCreateItem(closeModalAfter: boolean = true) {
    this.crudService.create(this.editForm.value).subscribe(
      (data) => {
        this.newItem.emit(data);
        this.cdRef.detectChanges();
        this.editForm.markAsPristine();
        this.editForm.markAsUntouched();
        this.isLoading = false;
        this.notificationService.onSuccess("L'enregistrement a été effectuer");
        this.ngOnInit();
        if (closeModalAfter) {
          this.onCloseModal('done');
        }
      },
      (error) => {
        if (error.status == 500) {
          this.notificationService.onError(
            "Impossible d'éffectuer cette requête"
          );
        }
        this.isLoading = false;
      }
    );
  }

  onCloseModal(result?: string) {
    if (this.editForm.dirty) {
      const confirmFunction = () => {
        this.activeModal.close(result);
      };
      this.notificationService.title = 'Modifications non enregistrées';
      this.notificationService.body = 'Voulez vous fermer cette fenêtre?';

      this.notificationService.titleMaxLength = 30;
      this.notificationService.backdrop = 0;

      this.notificationService.onConfirmation(confirmFunction);
      this.notificationService.titleMaxLength = 15;
      this.notificationService.backdrop = -1;
    } else {
      this.activeModal.close(result);
    }
  }

  onSubmit(closeModalAfter = true) {
    this.isLoading = true;
    if (this.isUpdating) {
      this.doUpdateItem(closeModalAfter);
    } else {
      this.doCreateItem(closeModalAfter);
    }
  }
}
