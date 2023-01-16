import { tap, switchMap } from 'rxjs/operators';
import { CacheService } from 'src/app/shared/services';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MasqueModuleUtilisateurFactory } from './../../../../core/services/adm/module-utilisateur-masque';
import { ModuleUtilisateurFactory } from 'src/app/core/services/adm/module-utilisateur';
import { IModuleUtilisateur } from 'src/app/core/models/adm/module-utilisateur';
import { IMasqueModuleUtilisateur } from './../../../../core/models/adm/module-utilisateur-masque';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Permission } from 'src/app/core/models/adm/permission';
import { element } from 'protractor';

@Component({
  selector: 'app-permission-edit',
  templateUrl: './permission-edit.component.html'
})
export class PermissionEditComponent implements OnInit {

  @Output() activePermission = new EventEmitter<String[]>();
  @Output() activePermissionCloseModal = new EventEmitter<String[]>();

  masques: IMasqueModuleUtilisateur[];
  modules: IModuleUtilisateur[];
  closeAfterSave;
  title = '';
  isFormSaving = false;
  isLoadingModules: boolean = true;
  isLoadingMasques: boolean = true;
  formTouched  = false;
  modulesList: {checked: boolean, icon: string,libelle: string, value: any, masque_id: number}[] = [];
  defaultPermissionData;
  set permission(permission: Observable<Permission[]>) {
    const service = this.cacheService.get('allModuleUtilisateurs',new ModuleUtilisateurFactory().list());
    service.pipe(
      tap(data=>{
        this.modules = data.data;
      }),
      switchMap(()=> permission)
    ).subscribe(data=> {
      this.defaultPermissionData = data;
      this.onResetForm();
      this.isLoadingModules = false;
    });
  };
  constructor(public activeModal: NgbActiveModal, protected cacheService: CacheService, private modalService: NgbModal) { }

  ngOnInit() {
    const service2 = this.cacheService.get('allMasqueModuleUtilisateurs',new MasqueModuleUtilisateurFactory().list());
    service2.subscribe(data=> {
      this.isLoadingMasques = false;
      this.masques = data.data;
    });
  }

  onResetForm() {
    this.modulesList  = [];
    this.modules.forEach(element => {
      let check = this.defaultPermissionData.filter(element2 => element2.libelle.includes(element.libelle)).length
      this.modulesList.push({
        checked: !!check,
        libelle: element.libelle,
        value: element.id,
        masque_id: element.masque_id,
        icon: element.icon
      })
    });
    this.formTouched = false;
  }
  onGetModulebyMasqueId(masque_id:number) {
    return this.modulesList.filter((module)=>module.masque_id ===masque_id);
  }

  onCountChecked(masque_id?: number, checked = true) {
    let data = this.modulesList;
    if(masque_id) {
      data = this.modulesList.filter((module)=>module.masque_id ===masque_id);
    }
    return data.filter(element => element.checked == checked).length
  }

  onsetAllCheck(masque_id: number, statut: boolean) {
    this.modulesList = this.modulesList.map(
      element => {
        if(element.masque_id === masque_id) {
          element.checked = statut;
        }
        return element;
      }
    )
    this.formTouched = true;
  }

  onSubmit(closeModal = false) {
    const result = this.modulesList.filter(element => element.checked);
    const mapped = result.map(element=> element.libelle);
    this.closeAfterSave = closeModal;
    this.activePermission.emit(mapped);
  }

}
