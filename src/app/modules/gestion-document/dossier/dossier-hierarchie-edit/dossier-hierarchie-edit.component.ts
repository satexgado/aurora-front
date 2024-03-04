import { Dossier } from 'src/app/core/models/gestion-document/dossier.model';
import { DossierFactory } from 'src/app/core/services/gestion-document/dossier.factory';
import { NotificationService } from 'src/app/shared/notification/notification.service';
import { QueryOptions } from 'src/app/shared/models/query-options/query-options.model';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TreeviewItem, TreeItem, TreeviewConfig, TreeviewHelper, TreeviewComponent } from 'ngx-treeview';
import {  remove, isNil  } from 'lodash';
import { EditComponent as DossierEditComponent } from  '../edit/edit.component'

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filterGrp } from 'src/app/shared/models/query-options/query-options.model';
import { Sort } from 'src/app/shared/models/query-options';
import { IDossier } from 'src/app/core/models/gestion-document/dossier.model';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { AdaptableMapper } from 'src/app/shared/decorator/adapter/adaptable-mapper';

@Component({
  selector: 'app-dossier-hierarchie-edit',
  templateUrl: './dossier-hierarchie-edit.component.html'
})
export class DossierHierarchieEditComponent {
  @ViewChild(TreeviewComponent) treeviewComponent: TreeviewComponent;

  @Input('filter') set filterInit(filter: filterGrp[]) {
    this.loadDossier(filter);
  }
  hierarchieItems: TreeviewItem[];
  selectedItem: TreeviewItem;
  nomDossier: string;
  newDossierLoading = false;
  parentUpdate;
  @Input() relation: {
    name: string,
    id: number
  }
  @Output('onSelectItem') selectedItemEmitter = new EventEmitter<IDossier>();
  @Input() hideUpdateDelete = false;
  @Input() hasRacine = false;
  @Input() exceptionId: number[];
  @Output() newDossierEmitter = new EventEmitter<IDossier>();

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

  loadDossier(filter: filterGrp[]  = []) {
    this.is_loading_tree = true;
    const service = new DossierFactory();
    const queryOptions = new QueryOptions(
      filter,
      ['dossiers'],
    ).setSort([new Sort('libelle', 'ASC')]);

    service.list(queryOptions).subscribe(
      data => {
        let dossiers = data.data;
        if(this.hasRacine) {
          let dossier = new Dossier();
          dossier.libelle = 'Acceuil';
          dossier.dossiers = dossiers;
          dossiers = [dossier];
        }
        this.hierarchieItems = this.converData({name: 'dossiers', value: dossiers}) as TreeviewItem[];
        this.is_loading_tree = false;

        return; 
        
        if(this.hasRacine) {
          this.is_loading_tree = true;
          const structureService = new StructureService();
          structureService.getByUserWDossiers(this.authService.user.id).subscribe(
            (data)=> {
              data.map(
                (element)=> {
                  let dossier = new Dossier();
                  dossier.libelle = element.libelle;
                  dossier.id = element.id;
                  Object.assign(dossier, {id: 'structure'+element.id})
                  let adapter = new AdaptableMapper(Dossier);
                  dossier.dossiers = element.dossiers.map((item: IDossier) => {
                    item = adapter.fromSource(item) as IDossier;
                    return Object.assign(item, {dossier_id: 'structure'+element.id});
                  })
                  let converted = this.converData({
                    'name': 'dossiers',
                    'value': [dossier]
                  }) as TreeviewItem[];
                  this.hierarchieItems = [...this.hierarchieItems, ...converted];
                }
              );
              this.is_loading_tree = false;
            }
          )
        }
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
        (data: IDossier) => {
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
              value: {extends: data, type: items.name, id: data.id, index: i, description: data.description, },
              collapsed: false,
              children: child
            });
          tree.push(element);
          i++;
        })
    }
    return tree;
  }

  ajouterDossier(parent = null)
  {
    const modalRef = this.modalService.open(DossierEditComponent,{ size: 'lg', centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as DossierEditComponent;
    instance.title = 'Ajouter un dossier';

    if(parent) {
      instance.dossierId = parent.value.id;
    }

    if(this.relation) {
      instance.relation =  this.relation;
    }

    instance.newItem.subscribe(
      (data: any) => {
        this.newDossierEmitter.emit(data);

        if(parent) {
          const converted = this.converData({
            'name': 'dossiers',
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
          'name': 'dossiers',
          'value': [data]
        }) as TreeviewItem[];
        this.hierarchieItems = [...this.hierarchieItems, ...converted];
      }
    );
  }
  quickAdd(parent) {
    let dossier = new Dossier();
    dossier.id = null;
    dossier.dossier_id = parent.value.id;
    this.parentUpdate = parent;
    if(parent) {
      const converted = this.converData({
        'name': 'dossiers',
        'value': [dossier]
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
    if(!libelle) {
      this.removeItem(item);
      return;
    }
    this.is_loading_tree = true;
    let dossier = new Dossier();
    dossier.libelle = libelle;
    dossier.dossier_id = item.value.extends.dossier_id;
    const service = new DossierFactory();
    service.create(dossier).subscribe(
      (data)=>{
        // this.parentUpdate.children.pop();
        item.libelle = '';
        this.newDossierEmitter.emit(data);
        const converted = this.converData({
          'name': 'dossiers',
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
    if(!this.nomDossier) {
      return;
    }

    this.is_loading_tree = true;

    let dossier = new Dossier();
    dossier.libelle = this.nomDossier;
    let creatVal = {...dossier};

    if(this.relation) {
      creatVal = {...{
        relation_name: this.relation.name,
        relation_id: this.relation.id,
      }, ...dossier}
    }
    const service = new DossierFactory();
    service.create(creatVal).subscribe(
      (data)=>{
        this.newDossierEmitter.emit(data);
        const converted = this.converData({
          'name': 'dossiers',
          'value': [data]
        }) as TreeviewItem[];
        this.hierarchieItems = [...this.hierarchieItems, ...converted];
        this.is_loading_tree = false;
        this.nomDossier = '';
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
      const service = new DossierFactory();
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
