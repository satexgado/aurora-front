import { shareReplay, map } from 'rxjs/operators';
import { IContact } from 'src/app/core/models/contact.model';
import { ContactFactory } from 'src/app/core/services/contact.factory';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';
import { IService } from 'src/app/core/models/service.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { Subscription, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppTitleService } from 'src/app/shared/services';
import { NotificationService, EditableListComponent } from 'src/app/shared';
import { EditComponent } from '../../../contact/edit/edit.component'
import { ChooseItem2Component } from 'src/app/modules/choose-item/single2/choose-item2.component';

@Component({
  selector: 'app-service-details-contact-ui',
  templateUrl: './sd-contact-ui.component.html'
})
export class ServiceDetailsContactComponent extends EditableListComponent  implements OnInit, OnDestroy {
    editModal = EditComponent;

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
      super(new ResourceScrollableHelper(new ContactFactory()))
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
                  {or: false, filters: [new Filter(`service_by_id`, this.service.id, 'eq')]}
            ],
            [],
            64,
            1
          );
          this.dataHelper = new ResourceScrollableHelper(new ContactFactory(), queryOptions);
          super.ngOnInit();
        });

      this.subscription.add(sub);
    }

    onShowCreateForm(item?, modal = this.editModal) {
      super.onShowCreateForm(item).subscribe(
         (data:IContact)=>{
           const service = new ContactFactory();
           service.attachAffectation(data.id, 'services', this.service.id).subscribe();
         }
      )
      return of(true);
   }

   onShowAddContactForm() {
    const modalRef  = this.modalService.open(ChooseItem2Component, {  centered: true,  backdrop: 'static' });
    const instance =  modalRef.componentInstance as ChooseItem2Component;
    instance.title = 'Choississez le contact';
    instance.isLoading = true;

    const allUserContacts$ = new ContactFactory().list(
      new QueryOptions(
          [
              {or: false, filters: [new Filter('isIns', true, 'eq')]},
          ],
          undefined,
          undefined,
          undefined,
          [new Sort('libelle', 'ASC')]
        )
      )
    .pipe(shareReplay(1), map(data => data.data));

    instance.dataSource$ = allUserContacts$;
    const contactId = this.dataHelper.currentData.map((contact: IContact) => contact.id);
    instance.cantSelectList = [{searchColumn: 'id', data: contactId}];
    instance.cantSelectMsg = 'Dejà affecter';
    instance.itemChoosen.subscribe(
      (data: IContact) => {

        this.isLoading = true;
        const service = new ContactFactory();
        service.attachAffectation(data.id, 'services', this.service.id).subscribe(
          (newContact: IContact) => {

          this.dataHelper.addItem(data);
          this.isLoading = false;
        }, () => {
          this.notificationService.onWarning('Une erreur est survenue');
          this.isLoading = false;
        });
      },
      () => {
      });
  }

  onRemoveContact(contact: IContact) {
    const confirm = () => {
        this.isLoading = true;
        const service = new ContactFactory();
        service.detachAffectation(contact.id, 'services', this.service.id).subscribe(
          () => {
            this.notificationService.onSuccess('L\'enregistrement a été effectuer' );
            this.dataHelper.removeItem(contact.id);
            this.isLoading = false;

          }, () => {
            this.notificationService.onInfo('l\'élément est utilisé');
          }
        );
    };
    this.onShowDeleteConfirm(contact.libelle, confirm);
  }

  onShowDeleteConfirm(libelle, confirm: () => void) {
    this.notificationService.title = 'Suppréssion';

    this.notificationService.body = 'Êtes-vous sûr(e) de vouloir supprimer?' + ' ' + libelle;

    const cancel = () => {
    };

    this.notificationService.bodyMaxLength = 300;
    this.notificationService.backdrop =  0;
    this.notificationService.onConfirmation(confirm, cancel);

    this.notificationService.bodyMaxLength = 80;
    this.notificationService.backdrop =  -1;
  }


  ngOnDestroy() {
      this.subscription.unsubscribe();
      this.service = null;
  }

}
