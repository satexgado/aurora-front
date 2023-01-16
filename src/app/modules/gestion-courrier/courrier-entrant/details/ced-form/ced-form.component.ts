import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { NgbDateAdapter, NgbModal, NgbDateParserFormatter, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTitleService, CacheService } from 'src/app/shared/services';
import { shouldDisableSubmit, getDirtyState } from 'src/app/shared/helperfonction';
import { NotificationService } from 'src/app/shared';
import { ICrCourrierEntrant } from 'src/app/core/models/gestion-courrier/cr-courrier-entrant';
import { CrCourrierEntrantFactory } from 'src/app/core/services/gestion-courrier/cr-courrier-entrant';
import { EditComponent as CrCoordonneeEditComponent } from 'src/app/express-courrier/coordonnee/edit/edit.component';
import { EditComponent as CrTypeEditComponent } from 'src/app/modules/gestion-courrier/type/edit/edit.component';
import { EditComponent as CrNatureEditComponent } from 'src/app/modules/gestion-courrier/nature/edit/edit.component';
import { EditComponent as CrUrgenceEditComponent } from 'src/app/modules/gestion-courrier/urgence/edit/edit.component';
import { CrTypeFactory } from 'src/app/core/services/gestion-courrier/cr-type';
import { map, shareReplay } from 'rxjs/operators';
import { CrNatureFactory } from 'src/app/core/services/gestion-courrier/cr-nature';
import { CrUrgenceFactory } from 'src/app/core/services/gestion-courrier/cr-urgence';
import { ICrCoordonnee } from 'src/app/core/models/gestion-courrier/cr-coordonnee';
import { CrCoordonneeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee';
import { CustomDateParserFormatter } from 'src/app/shared/custom-config/ngdatepicker.custom';
import { NgbDateToStringAdapter } from 'src/app/shared/components/custom-input/ngb-datetime/ngb-date-to-string-adapter';

@Component({
  selector: 'app-courrier-details_form',
  templateUrl: './ced-form.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateToStringAdapter },
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class CourrierEntrantDetailsFormComponent implements OnDestroy {

    subscription: Subscription = new Subscription();
    @Input()  set initCourrier(courrier: ICrCourrierEntrant) {
        this.courrier = courrier;
        this.onResetForm();
    };
    @Output() updatedItem = new EventEmitter<any>();
    courrier: ICrCourrierEntrant;
    is_form_saving = false;
    courrierForm = new FormGroup({
        id: new FormControl('', Validators.required),
        urgence_id: new FormControl('',Validators.required),
        type_id: new FormControl('',Validators.required),
        nature_id: new FormControl('',Validators.required),
        commentaire: new FormControl(''),
        date_redaction: new FormControl('',Validators.required),
        date_limit: new FormControl('',Validators.required),
        objet: new FormControl('',Validators.required),
        date_arrive: new FormControl('',Validators.required),
        expediteur_id: new FormControl('',Validators.required),
      });
    shouldDisableBatimentSubmit = () => shouldDisableSubmit(this.courrierForm);

    protected readonly allCrTypes$ = this.cacheService.get(
      'allCrTypes',
      new CrTypeFactory().list().pipe(
        shareReplay(1),
        map(data => data.data)
      ),
      1800000);

      protected readonly CrTypeEditComponent = CrTypeEditComponent;

      protected readonly allCrNatures$ = this.cacheService.get(
      'allCrNatures',
      new CrNatureFactory().list().pipe(
        shareReplay(1),
        map(data => data.data)
      ),
      1800000);

      protected readonly CrNatureEditComponent = CrNatureEditComponent;

      protected readonly allCrUrgences$ = this.cacheService.get(
      'allCrUrgences',
      new CrUrgenceFactory().list().pipe(
        shareReplay(1),
        map(data => data.data)
      ),
      1800000);

      protected readonly CrUrgenceEditComponent = CrUrgenceEditComponent;

      allCoordonnees$: Observable<ICrCoordonnee[]>;
      protected readonly CoordonneeEditComponent = CrCoordonneeEditComponent;
      allCoordonnees: ICrCoordonnee[];

    constructor(
        protected cacheService: CacheService,
        protected titleservice: AppTitleService,
        protected service: CrCourrierEntrantFactory,
        protected notificationService: NotificationService,
        public activeModal: NgbActiveModal,
        protected modalService: NgbModal
    ) { }

    onResetForm() {
        this.courrierForm.reset();
        this.courrierForm.get('expediteur_id').setValue(this.courrier.expediteur_id);
        this.courrierForm.get('date_arrive').setValue(this.courrier.date_arrive);
        this.courrierForm.get('date_redaction').setValue(this.courrier.courrier.date_redaction);
        this.courrierForm.get('date_limit').setValue(this.courrier.courrier.date_limit);
        this.courrierForm.get('commentaire').setValue(this.courrier.courrier.commentaire);
        this.courrierForm.get('nature_id').setValue(this.courrier.courrier.nature_id);
        this.courrierForm.get('type_id').setValue(this.courrier.courrier.type_id);
        this.courrierForm.get('urgence_id').setValue(this.courrier.courrier.urgence_id);
        this.courrierForm.get('objet').setValue(this.courrier.courrier.objet);
        this.courrierForm.get('id').setValue(this.courrier.id);
    }

    onSaveFormData() {
        this.is_form_saving = true;

        // return only dirty controller values as array except id
        const updatedFields = getDirtyState(this.courrierForm, new Set(['id']));

        if (Object.keys(updatedFields).length) {
          return this.service.update(updatedFields).subscribe(
            (data) => {
                this.is_form_saving = false;
                this.courrier = data;
                this.courrierForm.markAsPristine();
                this.courrierForm.markAsUntouched();
                this.notificationService.onSuccess('Toutes les modifications ont été enregistré');
                this.updatedItem.emit(data);
                this.onCloseModal('done');
          }, error => {
            if (error.status == 500) {
              this.notificationService.onError('Impossible d\'éffectuer cette requête');
              this.is_form_saving = false;
            }
          });
        }
    }

    ngOnDestroy()
    {
        this.subscription.unsubscribe();
        this.courrier = null;
    }

    onCloseModal(result?: string) {
      if (this.courrierForm.dirty) {
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
}
