import { IServiceType } from './../../../../core/models/service-type.model';
import { ServiceFactory } from './../../../../core/services/service.factory';
import { Select2DefaultDirective } from './../../../../shared/directives/select2-default.directive';
import { Component, Input, ChangeDetectorRef, OnInit, ViewChild, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {  Validators } from '@angular/forms';
import { Service, IService } from 'src/app/core/models/service.model';
import { shareReplay, map, tap } from 'rxjs/operators';
import { ServiceTypeFactory } from 'src/app/core/services/service-type.factory';
import { CacheService } from 'src/app/shared/services';
import { QueryOptions, Filter } from 'src/app/shared/models/query-options';
import { Subscription, of, BehaviorSubject } from 'rxjs';
import { FonctionFactory } from 'src/app/core/services/ressource-humaine/fonction';
import {EditComponent as TypeEditComponent} from 'src/app/modules/config/type-service/edit/edit.component'

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent implements  OnDestroy  {
  @ViewChildren(Select2DefaultDirective) select2Children: QueryList<Select2DefaultDirective>;
  heading = 'service';
  @Input() item: Service = new Service();
  is_loading_fonctions = true;
  allTypes: IServiceType[] = [];
  subcription = new Subscription();
  parentData: {relationName: string,relationId: number} = null;


  protected readonly allServiceType$ =new ServiceTypeFactory().list(new QueryOptions(
    [
      {or: false, filters:[new Filter('isIns', true, 'eq')]},
  ]
  )).pipe(
    shareReplay(1),
    map(data => data.data)
  );
  constructor(
    protected cacheService: CacheService,
    protected modalService: NgbModal,
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal)
  {
    super(new ServiceFactory(),cdRef, activeModal);
  }

  createFormGroup(item: IService) {

    return this.formBuilder.group({
      'type_id': [item.type_id, Validators.required],
      'description': [item.description, Validators.required],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }

  onShowCreateTypeForm() {
    const modalRef = this.modalService.open(TypeEditComponent, { size: 'lg', centered: true, backdrop: 'static' });
    modalRef.componentInstance.isUpdating = false;
    modalRef.componentInstance.title = 'Ajouter un type';

    modalRef.componentInstance.newItem.subscribe(
      (data: IServiceType) => {
        this.allTypes ? this.allTypes = [data] : this.allTypes.unshift(data);
        this.editForm.get('type_id').setValue(data.id);
      }
    );
  }

  ngOnDestroy() {
    this.subcription.unsubscribe();
  }
}
