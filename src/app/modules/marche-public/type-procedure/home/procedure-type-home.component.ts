import { MpProcedureTypeEtapeFactory } from './../../../../core/services/marche-public/type-procedure-etape.model';
import { MpProcedureTypeEtape, IMpProcedureTypeEtape } from './../../../../core/models/marche-public/type-procedure-etape.model';
import { Component, OnInit } from '@angular/core';
import { Filter } from 'src/app/shared/models/query-options';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IMpProcedureType } from 'src/app/core/models/marche-public/type-procedure.model';
import { EditComponent } from '../edit/edit.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from 'src/app/shared';

@Component({
  selector: 'app-procedure-type-home',
  templateUrl: 'procedure-type-home.component.html'
})

export class ProcedureTypeHomeComponent implements OnInit {
  procedureFilter = [
    {or: false, filters:[
      new Filter('isIns', true, 'eq'),
      new Filter('noParent', true, 'eq'),
    ]},
  ];
  nomEtape: string;
  newProcedureLoading = false;
  selectProcedure: IMpProcedureType;

  constructor(
    protected modalService: NgbModal,
    protected notificationService: NotificationService
  ) { }

  ngOnInit() { }


  onSetSelected(procedure: IMpProcedureType) {
    this.selectProcedure = procedure;
  }

  quickCreation() {
    if(!this.nomEtape) {
      return;
    }

    this.newProcedureLoading = true;

    let type_procedure = new MpProcedureTypeEtape();
    type_procedure.libelle = this.nomEtape;
    type_procedure.type_procedure_id = this.selectProcedure.id;
    type_procedure.position = this.selectProcedure.etapes && this.selectProcedure.etapes.length ? this.selectProcedure.etapes.length : 0;
    const service = new MpProcedureTypeEtapeFactory();
    service.create(type_procedure).subscribe(
      (data)=>{
        this.nomEtape = '';
        this.newProcedureLoading = false;
        if(data.type_procedure_id == this.selectProcedure.id) {
          if(!this.selectProcedure.etapes) {
            this.selectProcedure.etapes = [];
          }
          this.selectProcedure.etapes.push(data);
        }
      }
    )
  }


  onDelete(item: IMpProcedureTypeEtape) {
    let _result$ = new BehaviorSubject<boolean>(false);
    const result$ = _result$.asObservable();
    const libelle =  item.libelle;
    this.notificationService.title = 'Suppréssion';
    this.notificationService.body = 'Êtes-vous sûr(e) de vouloir supprimer?' + ' ' + item.libelle;


    const cancelDelete = (index: number = 0) => {
      const service = new MpProcedureTypeEtapeFactory();
      service.restore(item.id).subscribe(
          (data) => {
            this.selectProcedure.etapes.splice(index, 0, data);
            this.notificationService.onInfo("La suppression a été annuler");
          }, () => {
          }
        );
    };

    const confirm = () => {
      let index = this.selectProcedure.etapes.findIndex(d => d.id === item.id); //find index in your array
      const service = new MpProcedureTypeEtapeFactory();
      service.delete(item.id).subscribe(
        () => {
          this.notificationService.onCancel(()=>{cancelDelete(index)}, "L'élément '"+libelle+"' a été supprimé" ,'Suppression' , 'success', 'Annuler la suppresion');
        }, () => {
          this.notificationService.onInfo('l\'élément est utilisé');
        }
      );
      this.selectProcedure.etapes.splice(index, 1);//remove element from array
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

  drop(event: CdkDragDrop<IMpProcedureTypeEtape[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      let mapped = event.container.data.map((v, i)=> {
        return {
          id: v.id,
          position: i
        }
      });

      let service = new MpProcedureTypeEtapeFactory();
      service.changePosition({type_procedures: mapped}).subscribe()

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
    // this.loadingData = true;
    // const service = new CrTypeFactory();
    // let id = this.etapesType.map(element=>element.id);
    // service.setAffectations(this.type.id, {cr_etapes: id}).subscribe(
    //   ()=> {
    //     this.notificationService.onSuccess('L\'enregistrement a été effectuer' );
    //     this.loadingData = false;
    //   }
    // )
  }

  onShowUpdateForm(item: any) {

        const modalRef = this.modalService.open(EditComponent, { size: 'lg', centered: true,  backdrop: 'static' });
        modalRef.componentInstance.title = `Modifier: ${item.libelle}`;
        modalRef.componentInstance.item = item;
        modalRef.componentInstance.isUpdating = true;
        modalRef.componentInstance.newItem.subscribe(
          (data) => {
            // this.dataHelper.updateItem(data);
            // _result$.next(data);
          }
        );
  }

  quickSave(item, libelle) {
    if(item.libelle == libelle || !libelle) {
      item.showForm = false;
      return;
    }

    // this.newProcedureLoading = true;
    const service = new MpProcedureTypeEtapeFactory();
    service.update({
      id: item.id,
      libelle: libelle
    }).subscribe(
      ()=>{
        // item.showForm = false;
        // item.libelle = libelle;
        // this.newProcedureLoading = false;
      }
    );

    item.showForm = false;
    item.libelle = libelle;
  }

}
