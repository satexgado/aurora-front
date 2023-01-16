import { CrMailFactory } from 'src/app/core/services/gestion-courrier/cr-mail';
import { CrMail, ICrMail } from 'src/app/core/models/gestion-courrier/cr-mail';
import { Component, Input, ChangeDetectorRef, OnInit, ViewChild, ElementRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {  FormControl, Validators } from '@angular/forms';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { UserFactory } from 'src/app/core/services/user.factory';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { IUser } from 'src/app/core/models/user';
import { Helper } from 'src/app/helpers/helper/helper';
import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditComponent implements OnInit  {
  heading = 'mail';
  @Input() item: CrMail = new CrMail();
  Editor = DecoupledEditor;
  fichiers: File[] = [];
  @ViewChild('filebtn') filebtn: ElementRef;

  dependancies = {
    structures: [],
    users: [],
    destinataires: [],
  };

  multiSetting = {
    singleSelection: false,
    selectAllText: 'Tout selectionner',
    unSelectAllText: 'Tout deselectionner',
    itemsShowLimit: 5,
    labelKey: 'libelle',
    primaryKey: 'form_id',
    enableSearchFilter: true
  };

  dependanciesLoading = {
    structures: false,
    users: false,
    destinataires: false
  };

  protected readonly allUsers$ = new UserFactory().list(new QueryOptions().setSort([new Sort('prenom','ASC'), new Sort('nom','ASC')])).pipe(
    shareReplay(1),
    map(data => data.data)
  );

  constructor(
    public structureService: StructureService,
    cdRef:ChangeDetectorRef,
    public helper2: Helper,
    activeModal: NgbActiveModal)
  {
    super(new CrMailFactory(),cdRef, activeModal);
  }

  public onReady( editor ) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
  }

  ngOnInit(): void {
      super.ngOnInit();
      this.onChange();
  }

  createFormGroup(item: ICrMail) {
    // let destinataires = [this.mapStructures(item.destinataire_structures), ...this.mapUsers(item.destinataire_personnes)];
    let destinataires = [];
    return this.formBuilder.group({
      'destinataire_structures': [item.destinataire_structures && item.destinataire_structures.length ? item.destinataire_structures.map(element=>element.id): null],
      'destinataire_personnes': [item.destinataire_personnes && item.destinataire_personnes.length ? item.destinataire_personnes.map(element=>element.id): null],
      'destinataires': [destinataires, Validators.required],
      'contenu': [item.contenu, Validators.required],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }

  onChange() {
    let destinataire_structuresControl = this.editForm.get('destinataire_structures') as FormControl;
    let destinataire_personnesControl = this.editForm.get('destinataire_personnes') as FormControl;
    let destinatairesControl = this.editForm.get('destinataires') as FormControl;

    destinatairesControl.valueChanges.subscribe(
      (val: any[])=> {
        destinataire_structuresControl.setValue(
          val.filter(element => element['form_destinataire_type'] == 'structure').map(element => element.id)
        );
        destinataire_structuresControl.markAsTouched();
        destinataire_structuresControl.markAsDirty();

        destinataire_personnesControl.setValue(
          val.filter(element => element['form_destinataire_type'] == 'personne').map(element => element.id)
        );
        destinataire_personnesControl.markAsTouched();
        destinataire_personnesControl.markAsDirty();
      }
    )
  }

  onAddFile(event) {
    const files = event.target.files;
    if(!this.fichiers) {
      this.fichiers = [];
    }
    for(let i = 0; i<files.length; i++) {
      this.fichiers.push(files[i]);
    }
  }

  onRemoveFile(i) {
    this.fichiers.splice(i,1);
  }

  onGetIcon(item: IFichier): string {
    const extension = item.fichier.split('.').pop();'';

    switch(extension) {
      case 'jpg': return 'fal fa-file-image';
      case 'jpeg': return 'fal fa-file-image';
      case 'png': return 'fal fa-file-image';
      case 'pdf': return 'fal fa-file-pdf';
      case 'doc': return 'fal fa-file-word';
      case 'docx': return 'fal fa-file-word';
      case 'pdf': return 'fal fa-file-zip';
      default: return 'fal fa-file';
    }
 }



 onCheckIfImage(item: IFichier) {
    const extension = item.fichier.split('.').pop();'';

    if(extension =='jpg' || extension =='jpeg' || extension =='png')
    {
      return true;
    }
    return false;
  }

  public getUsers(): void {
    this.dependanciesLoading.users = true;
    this.allUsers$.subscribe((users: any) => {
      this.dependancies.users = users;
      this.dependanciesLoading.users = false;
    });
  }

  public getStructures(): void {
    if(this.dependancies.structures && this.dependancies.structures.length) {
      return;
    }
    this.dependanciesLoading.structures = true;
    this.structureService.all(false).subscribe((structures: any) => {
      this.dependancies.structures = structures;
      this.dependanciesLoading.structures = false;
    });
  }

  mapStructures(structures: any[]) {
    return structures.map((element=>{
      element['form_destinataire_type'] = 'structure';
      element['form_id'] = 'structure'+element.id;
      return element
    }))
  }

  mapUsers(users: IUser[]) {
    return users.map((element=>{
      element['form_destinataire_type'] = 'personne';
      element['form_id'] = 'personne'+element.id;
      return element
    }));
  }

  public getDestinataires(): void {
    if(this.dependancies.destinataires && this.dependancies.destinataires.length) {
      return;
    }
    let combinedData = [];
    this.dependanciesLoading.destinataires = true;
    this.structureService.all(false).pipe(
      switchMap(
        (structure: any[]) => {
          this.dependanciesLoading.structures = false;
          this.dependancies.structures = structure;
          combinedData = this.mapStructures(structure);
          return this.allUsers$;
        }
      )
    ).subscribe((users: IUser[]) => {
      this.dependancies.users = users;
      this.dependanciesLoading.users = false;
      let mapped = this.mapUsers(users);

      combinedData = [...combinedData,...mapped];
      this.dependancies.destinataires = combinedData;
      this.dependanciesLoading.destinataires = false;
    });
  }

  doCreateItem(closeModalAfter: boolean = true) {
    let savedData = this.editForm.value;

    if(this.fichiers && this.fichiers.length) {
      savedData['fichier_count'] = this.fichiers.length;
      for(let i = 0; i < this.fichiers.length; i++) {
        savedData[`fichier${i}`]=this.fichiers[i];
      }
    }

    this.crudService.create(savedData)
    .subscribe(
      (data) => {
        this.newItem.emit(data);
        this.cdRef.detectChanges();
        this.editForm.markAsPristine();
        this.editForm.markAsUntouched();
        this.isLoading = false;
        this.notificationService.onSuccess('L\'enregistrement a été effectuer' );
        this.ngOnInit();
        if(closeModalAfter){
          this.onCloseModal('done');
        }
      }, error => {
        if (error.status == 500) {
            this.notificationService.onError('Impossible d\'éffectuer cette requête');
          }
        this.isLoading = false;
      }
    );
  }

}
