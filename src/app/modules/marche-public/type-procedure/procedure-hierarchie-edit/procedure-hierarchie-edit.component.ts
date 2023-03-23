import { NotificationService } from 'src/app/shared/notification/notification.service';
import { QueryOptions } from 'src/app/shared/models/query-options/query-options.model';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TreeviewItem, TreeItem, TreeviewConfig, TreeviewHelper, TreeviewComponent } from 'ngx-treeview';
import {  remove, isNil  } from 'lodash';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filterGrp } from 'src/app/shared/models/query-options/query-options.model';
import { Sort } from 'src/app/shared/models/query-options';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { IMpProcedureType, MpProcedureType } from 'src/app/core/models/marche-public/type-procedure.model';
import { MpProcedureTypeFactory } from 'src/app/core/services/marche-public/type-procedure.model';
import { EditComponent as ProcedureEditComponent } from '../edit/edit.component'

@Component({
  selector: 'app-procedure-hierarchie-edit',
  templateUrl: './procedure-hierarchie-edit.component.html'
})
export class ProcedureHierarchieEditComponent {
  @ViewChild(TreeviewComponent) treeviewComponent: TreeviewComponent;

  @Input('filter') set filterInit(filter: filterGrp[]) {
    this.loadProcedure(filter);
  }
  hierarchieItems: TreeviewItem[];
  selectedItem: TreeviewItem;
  nomProcedure: string;
  newProcedureLoading = false;
  parentUpdate;
  @Output('onSelectItem') selectedItemEmitter = new EventEmitter<IMpProcedureType>();
  @Input() hideUpdateDelete = false;
  @Input() hasRacine = false;
  @Input() exceptionId: number[];
  @Output() newProcedureEmitter = new EventEmitter<IMpProcedureType>();

  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: true,
    maxHeight: 2000
  });

  is_loading_tree = true;

  constructor(
    private modalService: NgbModal,
    public authService: AuthService,
    private notificationService: NotificationService
  ) {}

  loadProcedure(filter: filterGrp[]  = []) {
    this.is_loading_tree = true;
    const service = new MpProcedureTypeFactory();
    const queryOptions = new QueryOptions(
      filter,
      ['mp_type_procedures.mp_type_procedure_etapes', 'mp_type_procedure_etapes'],
    ).setSort([new Sort('libelle', 'ASC')]);

    service.list(queryOptions).subscribe(
      data => {
        let type_procedures = data.data;
        if(this.hasRacine) {
          let type_procedure = new MpProcedureType();
          type_procedure.libelle = 'Acceuil';
          type_procedure.type_procedures = type_procedures;
          type_procedures = [type_procedure];
        }
        this.hierarchieItems = this.converData({name: 'type_procedures', value: type_procedures}) as TreeviewItem[];
        this.is_loading_tree = false;
      }
    )
  }

  converData(items: {name: string, value: any})
  {
    let tree: TreeItem[] = [];
    let i = 0;
    if(items.value)
    {
      Object.values(items.value).forEach(
        (data: IMpProcedureType) => {
          if(this.exceptionId && this.exceptionId.includes(data.id)) {
            return;
          };
          let child = [];

          if( data.children  && data.children.value  &&data.children.value.length)
          {
            child = this.converData(data.children);
          }

          const text =  data.libelle;
          let element = new TreeviewItem(
            {
              text: text,
              value: {extends: data, type: items.name, id: data.id, index: i },
              collapsed: false,
              children: child
            });
            element['libelle']=data.libelle;
          tree.push(element);
          i++;
        })
    }
    return tree;
  }

  ajouterProcedure(parent = null)
  {
    const modalRef = this.modalService.open(ProcedureEditComponent,{ size: 'lg', centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as ProcedureEditComponent;
    instance.title = 'Ajouter un type de procedures';
    if(parent) {
      instance.typeId = parent.value.id;
    }
    instance.newItem.subscribe(
      (data: any) => {
        this.newProcedureEmitter.emit(data);

        if(parent) {
          const converted = this.converData({
            'name': 'type_procedures',
            'value': [data]
          }) as TreeviewItem[];
          if(!parent.children) {
            parent.children = [...converted];
          } else {
            parent.children = [...parent.children, ...converted]
          }
          return;
        }
        const converted = this.converData({
          'name': 'type_procedures',
          'value': [data]
        }) as TreeviewItem[];
        this.hierarchieItems = [...this.hierarchieItems, ...converted];
      }
    );
  }
  quickAdd(parent) {
    let type_procedure = new MpProcedureType();
    type_procedure.id = null;
    type_procedure.type_id = parent.value.id;
    this.parentUpdate = parent;
    if(parent) {
      const converted = this.converData({
        'name': 'type_procedures',
        'value': [type_procedure]
      }) as TreeviewItem[];
      if(!parent.children) {
        parent.children = [...converted];
      } else {
        parent.children = [ ...converted, ...parent.children]
      }
      return;
    }
  }

  quickConsole(item, libelle) {
    if(item && item.value && item.value.id) {
      this.quickUpdate(item, libelle);
    } else {
      this.quickSave(item, libelle);
    }
  }

  quickUpdate(item, libelle) {
    if((!libelle) || item.value.extends.libelle == libelle ) {
      item.text = item.value.extends.libelle;
      item.libelle = item.value.extends.libelle;
      return;
    }

    // this.is_loading_tree = true;
    const service = new MpProcedureTypeFactory();
    service.update({
      id: item.value.id,
      libelle: libelle
    }).subscribe(
      ()=>{
        // item.value.extends.libelle = libelle;
        // item.text = libelle;
        // this.is_loading_tree = false;
      }
    );

    item.value.extends.libelle = libelle;
    item.text = libelle;
  }

  quickSave(item, libelle) {
    if(!libelle) {
      this.removeItem(item);
      return;
    }
    this.is_loading_tree = true;
    let type_procedure = new MpProcedureType();
    type_procedure.libelle = libelle;
    type_procedure.type_id = item.value.extends.type_id;
    const service = new MpProcedureTypeFactory();
    service.create(type_procedure).subscribe(
      (data)=>{
        // this.parentUpdate.children.pop();
        item.libelle = '';
        this.newProcedureEmitter.emit(data);
        const converted = this.converData({
          'name': 'type_procedures',
          'value': [data]
        }) as TreeviewItem[];
        if(!this.parentUpdate.children) {
          this.parentUpdate.children = [...converted];
        } else {
          this.parentUpdate.children = [...this.parentUpdate.children, ...converted]
        }
        this.is_loading_tree = false;
      }
    )
  }

  quickCreation() {
    if(!this.nomProcedure) {
      return;
    }

    this.is_loading_tree = true;

    let type_procedure = new MpProcedureType();
    type_procedure.libelle = this.nomProcedure;
    const service = new MpProcedureTypeFactory();
    service.create(type_procedure).subscribe(
      (data)=>{
        this.newProcedureEmitter.emit(data);
        const converted = this.converData({
          'name': 'type_procedures',
          'value': [data]
        }) as TreeviewItem[];
        this.hierarchieItems = [...this.hierarchieItems, ...converted];
        this.is_loading_tree = false;
        this.nomProcedure = '';
      }
    )
  }

  removeChild(item)
  {
    const confirm = ()=>{
      this.is_loading_tree = true;

      const funct1 = ()=> {
        this.is_loading_tree = false;
        this.removeItem(item);
      };
      const service = new MpProcedureTypeFactory();
      service.delete(item.value.id).subscribe(funct1);
    }

    this.notificationService.title = 'Suppréssion';
    this.notificationService.body = `Êtes-vous sûr(e) de vouloir supprimer? ${item.text}`;
    this.notificationService.backdrop =  0;

    this.notificationService.onConfirmation(confirm);
    this.notificationService.backdrop =  -1;

  }

  removeItem(item: TreeviewItem) {
    let isRemoved = false;
    for (const tmpItem of this.hierarchieItems) {
        if (tmpItem === item) {
            remove(this.hierarchieItems, item);
        } else {
            isRemoved = TreeviewHelper.removeItem(tmpItem, item);
            if (isRemoved) {
                break;
            }
        }
    }

    if (isRemoved) {
        this.treeviewComponent.raiseSelectedChange();
    }
  }

  findParent(item: TreeviewItem)
  {
    let parent = undefined;

    for (const tmpItem of this.hierarchieItems) {
        if (tmpItem === item) {
           parent = this.hierarchieItems;
           break;
        } else {
            parent = TreeviewHelper.findParent(tmpItem, item);
            if (parent) {
                break;
            }
        }
    }

    return parent;
  }

  onItemChoosed(item: TreeviewItem)
  {
    this.selectedItem = item;
    this.selectedItemEmitter.emit(item.value.extends);
  }
}
