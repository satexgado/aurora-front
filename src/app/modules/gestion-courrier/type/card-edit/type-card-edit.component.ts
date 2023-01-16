import { NotificationService } from './../../../../shared/notification/notification.service';
import { QueryOptions } from './../../../../shared/models/query-options/query-options.model';
import { Component, Input } from '@angular/core';
import { Filter } from 'src/app/shared/models/query-options';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { EditComponent as EtapeEditComponent} from './../../etape/edit/edit.component'
import { ICrType } from 'src/app/core/models/gestion-courrier/cr-type';
import { CrEtape, ICrEtape } from 'src/app/core/models/gestion-courrier/cr-etape';
import { CrEtapeFactory } from 'src/app/core/services/gestion-courrier/cr-etape';
@Component({
  selector: 'app-type-card-edit',
  templateUrl: './type-card-edit.component.html'
})
export class TypeCardEditComponent {

  @Input('type') set typeInit(type: ICrType) {
    this.type = type;
    this.loadEtape();
  }
  etapes: ICrEtape[];
  currentEtape: ICrEtape;
  public droppablesZone: any[] = [];
  type: ICrType;
  is_loading_etape = true;
  searchValue: string = '';

  constructor(
    protected modalService: NgbModal,
    protected notificationService: NotificationService
  ) {}

  loadEtape() {
    this.is_loading_etape = true;
    const service = new CrEtapeFactory();
    const queryOptions = new QueryOptions(
      [
        {or: true, filters:[new Filter('type_id', this.type.id, 'eq')]},
    ],
    ['cr_statut','responsable']
    )

    service.list(queryOptions).subscribe(
      data => {
        this.etapes = data.data;
        this.is_loading_etape = false;
        this.etapes.map(
          (etape) => {
             this.droppablesZone.push(etape.id);
          }
        );
        if (this.etapes[0] && !this.currentEtape) {
          this.currentEtape = this.etapes[0];
        }
      }
    )
  }

  onChangeCurrentEtape(etape: CrEtape) {
    this.currentEtape = etape;
    this.searchValue= '';
  }


  onItemChoosed(item)
  {
    this.currentEtape = item;
  }

  /* Etape CRUD START */
onShowAddEtapeForm() {
  const modalRef  = this.modalService.open(EtapeEditComponent, {  centered: true,  backdrop: 'static' });
  const instance =  modalRef.componentInstance as EtapeEditComponent;
  const item = new CrEtape();
  item.type_id = this.type.id;
  instance.item = item;
  instance.title = 'Ajouter';
  instance.newItem.subscribe(
    (data: any) => {
      this.is_loading_etape = true;
      this.etapes.push(data);
      this.currentEtape = data;
      this.is_loading_etape = false;
    }
  );
}

onShowUpdateEtapeForm(item: CrEtape) {
if(!item.id) {
  return ;
}
event.stopPropagation();
const modalRef = this.modalService.open(EtapeEditComponent, { centered: true,  backdrop: 'static' });
const instance =  modalRef.componentInstance as EtapeEditComponent;
instance.title = `Modifier: ${item.libelle}`;
instance.item = item;
instance.isUpdating = true;

instance.newItem.subscribe(
  (data) => {
    this.is_loading_etape = true;
    this.etapes = this.etapes.map(itm => {
      if (itm.id === data.id ) {
          itm = data;
      }
      return itm;
    });
    this.is_loading_etape = false;
  }
);
}

onRemoveEtape(etape: CrEtape) {
  const confirm = () => {
    this.is_loading_etape = true;
      const service = new CrEtapeFactory();
      service.delete(etape.id).subscribe(
        () => {
          const index = this.etapes.findIndex(element => element.id === etape.id);
          this.etapes.splice(index, 1);

          if(etape.id === this.currentEtape.id) {
            this.currentEtape = null;
          }

          if (this.etapes[0] && !this.currentEtape) {
            this.currentEtape = this.etapes[0];
          }

          this.is_loading_etape = false;
        }, () => {
          this.notificationService.onInfo('l\'élément est utilisé');
        }
      );
  };
  this.onShowDeleteConfirm(etape.libelle, confirm);
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

sortByField(array: any[], field: string) {
  return array.sort(
    (a, b) => {
      if (a[field] < b[field]) {
       return -1;
      }
      if (a[field] > b[field]) {
       return 1;
      }
      return 0;
     }
  );
}

beforeChange($event: NgbNavChangeEvent) {
  if ($event.nextId === 'tabs-newetape') {
    $event.preventDefault();
  }
}

}
