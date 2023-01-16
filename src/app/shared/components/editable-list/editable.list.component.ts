import { Component, ViewChildren, QueryList, OnInit, OnDestroy, Injectable, Directive } from '@angular/core';
import { SortEvent, NgbdSortableHeader } from 'src/app/shared/directives/sortable.directive';
import { Subject, BehaviorSubject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AppInjector } from '../../services';
import { ResourceScrollableHelper } from '../../state/resource.scrollable.helper';
import { ItemSelectHelper } from '../../state/item.select.helper';
import { NotificationService } from '../../notification';
import { Resource } from '../../state';

@Directive({
  selector: 'whynot'
})
@Injectable()
export class EditableListComponent extends ItemSelectHelper implements OnInit {
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  _isEditorLoading = false;
  changePage: Subject<number> = new Subject<number>();
  editModal;
  affectationModal;

  new_item_title = 'Créer un nouveau';
  protected modalService: NgbModal;
  dataHelper: ResourceScrollableHelper;
  protected notificationService: NotificationService;

  constructor(dataHelper: ResourceScrollableHelper) {
    super();
    this.dataHelper = dataHelper;
    const injector = AppInjector.getInjector();
    this.modalService = injector.get(NgbModal);
    this.notificationService = injector.get(NotificationService);
  }

  ngOnInit() {

    this.dataHelper.loadData(1);

    this.changePage.pipe(
      debounceTime(1500),
      distinctUntilChanged()
    )
    .subscribe(page => this.dataHelper.page = page);
  }

  checkData() {
    if(this.dataHelper.hasMoreData) {
      this.dataHelper.loadData();
    }
  }

  changed(page: number) {
    this.changePage.next(page);
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.dataHelper.sortColumn = column;
    this.dataHelper.sortDirection = direction;
  }

  onShowCreateForm(item?, modal = this.editModal) {
    let _result$ = new Subject<any>();
    const result$ = _result$.asObservable();
    if (modal) {
        const modalRef = this.modalService.open(this.editModal, { size: 'lg', centered: true, backdrop: 'static' });
        modalRef.componentInstance.isUpdating = false;
        modalRef.componentInstance.title = 'Créer';

        // In case it's create from existing element
        if (item) {
          modalRef.componentInstance.title = item.libelle ? `Créer comme: ${item.libelle}` : 'Créer';
          modalRef.componentInstance.item = item;
        }

        modalRef.componentInstance.newItem.subscribe(
          (data: any) => {
            this.dataHelper.addItem(data);
            _result$.next(data);
          }
        );
    }

    return result$;
  }

  onShowUpdateForm(item: any, modal = this.editModal) {
    let _result$ = new Subject<any>();
    const result$ = _result$.asObservable();
    if (modal) {
        const modalRef = this.modalService.open(this.editModal, { size: 'lg', centered: true,  backdrop: 'static' });
        modalRef.componentInstance.title = `Modifier: ${item.libelle}`;
        modalRef.componentInstance.item = item;
        modalRef.componentInstance.isUpdating = true;
        modalRef.componentInstance.newItem.subscribe(
          (data) => {
            this.dataHelper.updateItem(data);
            _result$.next(data);
          }
        );
    }
    return result$;
  }

  onAffectationForm() {
    if (this.affectationModal) {
        const modalRef = this.modalService.open(this.affectationModal, { size: 'lg', centered: true,  backdrop: 'static' });
    }
  }

  onUpdateItem(index: number, value, colname: string) {
    this._isEditorLoading=true;
    let data = {};
    data['id'] = index;
    data[colname] = value;
    this.dataHelper.service.update(data)
      .subscribe(
        (data) => {
          this.dataHelper.updateItem(data);
          this._isEditorLoading= false;
        }
      )
  }

  onDelete(item: Resource) {
    let _result$ = new BehaviorSubject<boolean>(false);
    const result$ = _result$.asObservable();
    const libelle =  item.libelle;
    const cancelDelete = (index: number = 0) => {
      this.dataHelper.service.restore(item.id).subscribe(
          (data) => {
            this.dataHelper.addItemTo(data, index);
            this.notificationService.onInfo("La suppression a été annuler");
          }, () => {
          }
        );
    };


    this.notificationService.title = 'Suppréssion';
    this.notificationService.body = 'Êtes-vous sûr(e) de vouloir supprimer?' + ' ' + item.libelle;

    const confirm = () => {
      this.dataHelper.service.delete(item.id).subscribe(
          () => {
            let index = this.dataHelper.removeItem(item.id) ?? 0;
            this.notificationService.onCancel(()=>{cancelDelete(index)}, "L'élément '"+libelle+"' a été supprimé" ,'Suppression' , 'success', 'Annuler la suppresion');
          }, () => {
            this.notificationService.onInfo('l\'élément est utilisé');
          }
        );
      _result$.next(true);
    };

    const cancel = () => {
      _result$.next(false);
    };

    this.notificationService.bodyMaxLength = 300;
    this.notificationService.backdrop =  0;
    this.notificationService.onConfirmation(confirm, cancel);

    this.notificationService.bodyMaxLength = 80;
    this.notificationService.backdrop =  -1;
    return result$;
  }

}
