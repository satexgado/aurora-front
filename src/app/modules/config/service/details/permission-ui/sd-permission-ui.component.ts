import { map, switchMap } from 'rxjs/operators';
import { PermissionFactory } from './../../../../../core/services/adm/permission';
import { PermissionEditComponent } from './../../../role-permission/permission-edit/permission-edit.component';
import { EtablissementFactory } from 'src/app/core/services/etablissement.factory';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';
import { IService } from 'src/app/core/models/service.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { Subscription, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTitleService } from 'src/app/shared/services';
import { NotificationService, EditableListComponent } from 'src/app/shared';
import { Etablissement } from 'src/app/core/models/etablissement';

@Component({
  selector: 'app-service-details-permission-ui',
  templateUrl: './sd-permission-ui.component.html'
})
export class ServiceDetailsPermissionComponent extends EditableListComponent  implements OnInit, OnDestroy {

    subscription: Subscription = new Subscription();
    service: IService;
    isLoading;
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      protected titleService: AppTitleService,
      protected modalService: NgbModal,
      protected notificationService: NotificationService,
    ) {
      super(new ResourceScrollableHelper(new EtablissementFactory()))
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
          const queryOptions = new QueryOptions(
            [
                {or: false, filters:[new Filter('isIns', true, 'eq')]},
                {or: true, filters:[new Filter('searchString', '', 'ct')]}
            ],
            [],
            64,
            1
          );
          this.dataHelper = new ResourceScrollableHelper(new EtablissementFactory(), queryOptions);
          super.ngOnInit();
        });

      this.subscription.add(sub);
    }

    onShowPermissionForm(etablissement: Etablissement) {
      const service = new PermissionFactory();
      const queryOptions = new QueryOptions(
        [
            {or: false, filters:[new Filter('ServiceById', this.service.id, 'eq'), new Filter('EtablissementById', etablissement.id, 'ct')]},
        ]
      );
      const modalRef = this.modalService.open(PermissionEditComponent, { size: 'lg', centered: true, backdrop: 'static' });
      const instance =  modalRef.componentInstance as PermissionEditComponent;
      instance.permission =  service.list(queryOptions).pipe(map(data=> data.data));
      instance.title = `Permissions: ${etablissement.libelle}`;
      instance.activePermission.pipe(
        map(
          (data)=> {
            instance.isFormSaving = true;
            return data.map(element => element+' etablibyid-'+etablissement.id);
          }
        ),
        switchMap((data)=> {
          const service = new PermissionFactory();
          return service.setGroupPermission({group_id: this.service.id, etablissement_id: etablissement.id, permissions_slug: data});
        })
      ).subscribe(
        (data)=> {
          this.notificationService.onSuccess('L\'enregistrement a été effectuer' );
          instance.isFormSaving = false;
          if(instance.closeAfterSave) {
            instance.activeModal.close('done');
          }
        }
      )
    }

  ngOnDestroy() {
      this.subscription.unsubscribe();
      this.service = null;
  }

}
