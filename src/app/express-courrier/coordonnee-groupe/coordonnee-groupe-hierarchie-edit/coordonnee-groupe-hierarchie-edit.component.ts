import { NotificationService } from 'src/app/shared/notification/notification.service';
import { QueryOptions } from 'src/app/shared/models/query-options/query-options.model';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TreeviewItem, TreeItem, TreeviewConfig, TreeviewHelper, TreeviewComponent } from 'ngx-treeview';
import {  remove, isNil  } from 'lodash';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filterGrp } from 'src/app/shared/models/query-options/query-options.model';
import { Filter, Sort } from 'src/app/shared/models/query-options';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { EditComponent as GroupeeEditComponent } from '../edit/edit.component'
import { CrCoordonneeGroupe, ICrCoordonneeGroupe } from 'src/app/core/models/gestion-courrier/cr-coordonnee-groupe';
import { CrCoordonneeGroupeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee-groupe';

@Component({
  selector: 'app-coordonnee-groupe-hierarchie-edit',
  templateUrl: './coordonnee-groupe-hierarchie-edit.component.html'
})
export class CoordonneeGroupeHierarchieEditComponent {
  @ViewChild(TreeviewComponent) treeviewComponent: TreeviewComponent;

  @Input('filter') set filterInit(filter: filterGrp[]) {
    this.loadGroupe(filter);
  }
  hierarchieItems: TreeviewItem[];
  selectedItem: TreeviewItem;
  nomGroupe: string;
  newGroupeLoading = false;
  parentUpdate;
  @Output('onSelectItem') selectedItemEmitter = new EventEmitter<ICrCoordonneeGroupe>();
  @Input() hideUpdateDelete = false;
  @Input() hasRacine = false;
  @Input() exceptionId: number[];
  @Output() newGroupeEmitter = new EventEmitter<ICrCoordonneeGroupe>();

  @Input() set updateDataNbCoordonnees(groupe: ICrCoordonneeGroupe) {
    let item = this.findItemInList(groupe.id);
    if(item && groupe) {
      item.value.extends.nb_coordonnees = groupe.nb_coordonnees;
      return;
    }
  } 

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

  loadGroupe(filter: filterGrp[]  = []) {
    this.is_loading_tree = true;
    filter = [...filter, ... [
      {or: false, filters:[
        new Filter('groupe_id', '', 'eq'),
      ]},
    ]] 
    const service = new CrCoordonneeGroupeFactory();
    const queryOptions = new QueryOptions(
      filter,
      ['cr_coordonnee_groupes'],
    ).setSort([new Sort('libelle', 'ASC')]);

    service.list(queryOptions).subscribe(
      data => {
        let groupes = data.data;
        if(this.hasRacine) {
          let groupe = new CrCoordonneeGroupe();
          groupe.libelle = 'Listes des groupes';
          groupe.groupes = groupes;
          groupes = [groupe];
        }
        this.hierarchieItems = this.converData({name: 'groupes', value: groupes}) as TreeviewItem[];
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
        (data: ICrCoordonneeGroupe) => {
          if(this.exceptionId && this.exceptionId.includes(data.id)) {
            return;
          };
          let child = [];

          if( data.children  && data.children.value  && data.children.value.length)
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

  ajouterGroupe(parent = null)
  {
    const modalRef = this.modalService.open(GroupeeEditComponent,{ size: 'lg', centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as GroupeeEditComponent;
    instance.title = 'Ajouter un groupe';
    if(parent) {
      instance.groupeId = parent.value.id;
    }
    instance.newItem.subscribe(
      (data: any) => {
        this.newGroupeEmitter.emit(data);

        if(parent) {
          const converted = this.converData({
            'name': 'groupes',
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
          'name': 'groupes',
          'value': [data]
        }) as TreeviewItem[];
        this.hierarchieItems = [...this.hierarchieItems, ...converted];
      }
    );
  }

  quickAdd(parent) {
    let groupe = new CrCoordonneeGroupe();
    groupe.id = null;
    groupe.groupe_id = parent.value.id;
    this.parentUpdate = parent;
    if(parent) {
      const converted = this.converData({
        'name': 'groupes',
        'value': [groupe]
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
    const service = new CrCoordonneeGroupeFactory();
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
    let groupe = new CrCoordonneeGroupe();
    groupe.libelle = libelle;
    groupe.groupe_id = item.value.extends.groupe_id;
    const service = new CrCoordonneeGroupeFactory();
    service.create(groupe).subscribe(
      (data)=>{
        // this.parentUpdate.children.pop();
        item.libelle = '';
        this.newGroupeEmitter.emit(data);
        const converted = this.converData({
          'name': 'groupes',
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
    if(!this.nomGroupe) {
      return;
    }

    this.is_loading_tree = true;

    let groupe = new CrCoordonneeGroupe();
    groupe.libelle = this.nomGroupe;
    const service = new CrCoordonneeGroupeFactory();
    service.create(groupe).subscribe(
      (data)=>{
        this.newGroupeEmitter.emit(data);
        const converted = this.converData({
          'name': 'groupes',
          'value': [data]
        }) as TreeviewItem[];
        this.hierarchieItems = [...this.hierarchieItems, ...converted];
        this.is_loading_tree = false;
        this.nomGroupe = '';
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
      const service = new CrCoordonneeGroupeFactory();
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

  findItem(root: any, value: any): any {
    if (isNil(root)) {
      return undefined;
    }

    if (root.value.id == value) {
      return root;
    }

    if (root.children) {
      for (const child of root.children) {
        const foundItem = this.findItem(child, value);
        if (foundItem) {
          return foundItem;
        }
      }
    }

    return undefined;
  }

  findItemInList(value: any): any {
    if (isNil(this.hierarchieItems)) {
      return undefined;
    }

    for (const item of this.hierarchieItems) {
      const foundItem = this.findItem(item, value);
      if (foundItem) {
        return foundItem;
      }
    }

    return undefined;
  }

}
