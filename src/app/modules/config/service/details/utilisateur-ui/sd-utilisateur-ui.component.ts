import { ServiceFactory } from 'src/app/core/services/service.factory';
import { shareReplay, map } from 'rxjs/operators';
import { QueryOptions, Filter } from 'src/app/shared/models/query-options';
import { ServiceTypeFactory } from 'src/app/core/services/service-type.factory';
import { shouldDisableSubmit, getDirtyState } from 'src/app/shared/helperfonction';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IService } from 'src/app/core/models/service.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTitleService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';

@Component({
  selector: 'app-service-details-information-ui',
  templateUrl: './sd-information-ui.component.html'
})
export class ServiceDetailsInformationComponent implements OnInit, OnDestroy {

    subscription: Subscription = new Subscription();
    service: IService;
    is_form_saving = false;
    serviceForm = new FormGroup({
      id: new FormControl('', Validators.required),
      description : new FormControl('', Validators.required),
      type_id : new FormControl('', Validators.required),
      libelle : new FormControl('', Validators.required)
    });
    shouldDisableProgrammeSubmit = () => shouldDisableSubmit(this.serviceForm);

    readonly allServiceType$ =new ServiceTypeFactory().list(new QueryOptions(
      [
        {or: false, filters:[new Filter('isIns', true, 'eq')]},
    ]
    )).pipe(
      shareReplay(1),
      map(data => data.data)
    );
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      protected titleService: AppTitleService,
      protected modalService: NgbModal,
      protected notificationService: NotificationService,
    ) {

    }

    ngOnInit() {
      const sub = this.route.parent.data
      .subscribe((data: { service: IService }) => {
          if (!data.service) {
            this.router.navigate(['/config/service']);
            return;
          }
          this.titleService.setTitle(data.service.libelle+' : details');
          this.service = data.service;
          this.onResetForm();
        });
      this.subscription.add(sub);
    }

    onResetForm() {
      this.serviceForm.reset();
      this.serviceForm.get('description').setValue(this.service.description);
      this.serviceForm.get('libelle').setValue(this.service.libelle);
      this.serviceForm.get('type_id').setValue(this.service.type_id);

      this.serviceForm.get('id').setValue(this.service.id);
  }

  onSaveFormData() {
    this.is_form_saving = true;

    // return only dirty controller values as array except id
    const updatedFields = getDirtyState(this.serviceForm, new Set(['id']));

    const service = new ServiceFactory();
    if (Object.keys(updatedFields).length) {
      return service.update(updatedFields).subscribe(
        (data) => {
          this.is_form_saving = false;
        this.service = data;
        this.notificationService.onSuccess('Toutes les modifications ont été enregistré');

      }, error => {
        if (error.status == 500) {
          this.notificationService.onError('Impossible d\'éffectuer cette requête');
          this.is_form_saving = false;
        }
      });
    }
}

  ngOnDestroy() {
      this.subscription.unsubscribe();
      this.service = null;
  }

}
