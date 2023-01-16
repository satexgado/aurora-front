import { switchMap } from 'rxjs/operators';
import { CrType, ICrType } from 'src/app/core/models/gestion-courrier/cr-type';
import { NotificationService } from 'src/app/shared/notification/notification.service';
import { Component, Input, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CrEtapeFactory } from 'src/app/core/services/gestion-courrier/cr-etape';
import { CrEtape, ICrEtape } from 'src/app/core/models/gestion-courrier/cr-etape';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { CrTypeFactory } from 'src/app/core/services/gestion-courrier/cr-type';
import {EditComponent} from '../../etape/edit/edit.component';

@Component({
  selector: 'app-type-hierarchie-edit',
  templateUrl: './type-hierarchie-edit.component.html',
  styleUrls: ['type-hierarchie-edit.component.css']
})
export class TypeHierarchieEditComponent {

  @Input('type') set typeInit(type: ICrType) {
    this.type = type;
    this.loadEtape();
  }
  type: ICrType;
  loadingData = false;
  etapes: ICrEtape[];
  etapesType: ICrEtape[] = [];

  constructor(
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) {}

  ajouterEtape() {
    const modalRef = this.modalService.open(EditComponent, { size: 'lg', centered: true, backdrop: 'static' });
    modalRef.componentInstance.isUpdating = false;
    modalRef.componentInstance.title = 'Créer';
    modalRef.componentInstance.newItem.subscribe(
      (data: any) => {
        this.etapes.push(data);
      }
    );
  }

  loadEtape(): void {
      this.loadingData = true;
      const service = new CrEtapeFactory();
      service.list(new QueryOptions().setIncludes(['responsable','structure']).setSort([new Sort('libelle', 'ASC')]) ).pipe(
        switchMap(
          (data)=> {
            this.etapes = data.data;
            return service.list(new QueryOptions().setFilterGroups(
              [
                {or: true, filters:[new Filter('parent_cr_type_id', this.type.id, 'eq')]},
              ]
            ).setIncludes(['responsable','structure']).setSort([new Sort('orderlyWay', 'desc')]))
          }
        )
      ).subscribe(
        (data)=> {
          data.data.forEach( (item, index) => {
            this.onDelete(item.id);
          });
          this.etapesType = data.data;
          this.loadingData = false;
        }
      );
  }

  onDelete(id: number) {
    let index = this.etapes.findIndex(d => d.id === id); //find index in your array
    this.etapes.splice(index, 1);//remove element from array
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  saveEtape() {
    this.loadingData = true;
    const service = new CrTypeFactory();
    let id = this.etapesType.map(element=>element.id);
    service.setAffectations(this.type.id, {cr_etapes: id}).subscribe(
      ()=> {
        this.notificationService.onSuccess('L\'enregistrement a été effectuer' );
        this.loadingData = false;
      }
    )
  }
}
