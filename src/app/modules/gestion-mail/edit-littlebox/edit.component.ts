import { GestionMailService } from './../gestion-mail.service';
import { CrMailFactory } from 'src/app/core/services/gestion-courrier/cr-mail';
import { CrMail, ICrMail } from 'src/app/core/models/gestion-courrier/cr-mail';
import { Component, Input, ChangeDetectorRef, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { UserFactory } from 'src/app/core/services/user.factory';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { IUser } from 'src/app/core/models/user';
import { Helper } from 'src/app/helpers/helper/helper';
import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';
import { BaseEditSimpleComponent } from 'src/app/shared/components/edit/base-edit-simple.component';

@Component({
  selector: 'app-edit-littlebox',
  templateUrl: './edit.component.html',
  styles: [`
        .collapseBtn {
          position: absolute;
          bottom: 0;
          left: 0;
      }

      @media (min-width: 992px) {
          .openCollapsible {
              max-width: 800px;
          }
      }

      @media (min-width: 576px) {
          .openCollapsible {
              max-width: 500px;
              margin: 1.75rem auto;
          }
      }

      .card-shadow-3 {
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
      }

      .zooming {
        zoom: 0.5;
-moz-transform: scale(0.5);
-moz-transform-origin: 0 0;
-o-transform: scale(0.5);
-o-transform-origin: 0 0;
-webkit-transform: scale(0.5);
-webkit-transform-origin: 0 0;
      }
  `]
})
export class EditLittleBoxComponent extends BaseEditSimpleComponent implements OnInit {
  heading = 'mail';
  @Input() item: CrMail = new CrMail();
  Editor = DecoupledEditor;
  fichiers: File[] = [];
  @ViewChild('filebtn') filebtn: ElementRef;
  isCollapsed = false;
  @Output() close = new EventEmitter<true>();

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
    text: 'Destinataires',
    badgeShowLimit: '2',
    enableSearchFilter: true,
    enableCheckAll: false
  };

  dependanciesLoading = {
    structures: false,
    users: false,
    destinataires: false
  };

  protected readonly allUsers$ = new UserFactory().list(new QueryOptions().setSort([new Sort('prenom', 'ASC'), new Sort('nom', 'ASC')])).pipe(
    shareReplay(1),
    map(data => data.data)
  );

  constructor(
    public structureService: StructureService,
    public gestionMailService: GestionMailService,
    cdRef: ChangeDetectorRef,
    public helper2: Helper) {
    super(new CrMailFactory(), cdRef);
  }


  public onReady(editor: DecoupledEditor) {

    editor.model.schema.register('p', {
      inheritAllFrom: '$paragraph',
      allowAttributes: ['class', 'style'],
      isBlock: true
    });

    // editor.model.schema.extend('$text', {
    //   allowAttributes: ['spanId', 'spanClass']
    // });

    // editor.conversion.for('upcast').elementToAttribute({
    //   view: {
    //     name: 'span',
    //     attributes: {
    //       'id': /.+/
    //     }
    //   },
    //   model: {
    //     key: 'spanId',
    //     value: viewElement => viewElement.getAttribute('id')
    //   }
    // });

    // editor.conversion.for('downcast').attributeToElement({
    //   model: 'spanId',
    //   view: (modelAttributeValue, viewWriter) => {
    //     return viewWriter.createAttributeElement('span', {
    //       id: modelAttributeValue
    //     });
    //   }
    // });

    // editor.conversion.attributeToAttribute( {
    //   model: {
    //     name: 'span',
    //     key: 'class',
    //     value: 'custom-class'
    //   },
    //   view: {
    //     name: 'figure',
    //     key: 'class',
    //     value: 'custom-class'
    //   }
    // } );

    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );

    // const dataFilter = editor.plugins.get( 'DataFilter' );
    //   console.log(dataFilter);
    //   dataFilter.allowElement( 'element-inline' );
    //   dataFilter.allowAttributes( { name: 'element-inline', attributes: { 'data-foo': false }, classes: [ 'foo' ] } );

  }

  onChangeBadgeLimit(value = 'All') {
    this.multiSetting = {
      singleSelection: false,
      selectAllText: 'Tout selectionner',
      unSelectAllText: 'Tout deselectionner',
      itemsShowLimit: 5,
      labelKey: 'libelle',
      primaryKey: 'form_id',
      text: 'Destinataires',
      badgeShowLimit: value,
      enableSearchFilter: true,
      enableCheckAll: false
    };
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.onChange();
  }

  createFormGroup(item: ICrMail) {
    let destinataires = [...this.mapStructures(item.destinataire_structures), ...this.mapUsers(item.destinataire_personnes)];
    return this.formBuilder.group({
      'destinataire_structures': [item.destinataire_structures && item.destinataire_structures.length ? item.destinataire_structures.map(element => element.id) : null],
      'destinataire_personnes': [item.destinataire_personnes && item.destinataire_personnes.length ? item.destinataire_personnes.map(element => element.id) : null],
      'destinataires': [destinataires, Validators.required],
      'mail_id': [item.mail_id],
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
      (val: any[]) => {
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
    if (!this.fichiers) {
      this.fichiers = [];
    }
    for (let i = 0; i < files.length; i++) {
      this.fichiers.push(files[i]);
    }
    this.onToggleContenuRequired();
  }

  onToggleContenuRequired() {
    let contenuCtrl = this.editForm.get('contenu') as FormControl;

    if(this.fichiers && this.fichiers.length) {
      contenuCtrl.clearValidators();
    } else {
      contenuCtrl.setValidators([Validators.required]);
    }

    contenuCtrl.updateValueAndValidity();
  }

  onRemoveFile(i) {
    this.fichiers.splice(i, 1);
    this.onToggleContenuRequired();
  }

  onGetIcon(item: IFichier): string {
    const extension = item.fichier.split('.').pop(); '';

    switch (extension) {
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
    const extension = item.fichier.split('.').pop(); '';

    if (extension == 'jpg' || extension == 'jpeg' || extension == 'png') {
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
    if (this.dependancies.structures && this.dependancies.structures.length) {
      return;
    }
    this.dependanciesLoading.structures = true;
    this.structureService.all(false).subscribe((structures: any) => {
      this.dependancies.structures = structures;
      this.dependanciesLoading.structures = false;
    });
  }

  mapStructures(structures: any[]) {
    if (!(structures && structures.length)) {
      return [];
    }
    return structures.map((element => {
      element['form_destinataire_type'] = 'structure';
      element['form_id'] = 'structure' + element.id;
      return element
    }))
  }

  mapUsers(users: IUser[]) {
    if (!(users && users.length)) {
      return [];
    }
    return users.map((element => {
      element['form_destinataire_type'] = 'personne';
      element['form_id'] = 'personne' + element.id;
      return element
    }));
  }

  public getDestinataires(): void {
    if (this.dependancies.destinataires && this.dependancies.destinataires.length) {
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

      combinedData = [...combinedData, ...mapped];
      this.dependancies.destinataires = combinedData;
      this.dependanciesLoading.destinataires = false;
    });
  }

  onSubmit(closeModalAfter = true) {
    this.isLoading = true;
    let savedData = this.editForm.value;

    if (this.fichiers && this.fichiers.length) {
      savedData['fichier_count'] = this.fichiers.length;
      for (let i = 0; i < this.fichiers.length; i++) {
        savedData[`fichier${i}`] = this.fichiers[i];
      }
    }

    this.crudService.create(savedData)
    .subscribe(
      (data) => {
          this.newItem.emit(data);
          this.gestionMailService.onEmailCreated$.next(data);
          this.cdRef.detectChanges();
          this.editForm.markAsPristine();
          this.editForm.markAsUntouched();
          this.isLoading = false;
          this.notificationService.onSuccess('L\'enregistrement a été effectuer');
          this.ngOnInit();
          if (closeModalAfter) {
            this.onCloseModal();
          }
      }, error => {
        if (error.status == 500) {
            this.notificationService.onError('Impossible d\'éffectuer cette requête');
          }
        this.isLoading = false;
      }
    );

  }

  doCreateItem(closeModalAfter: boolean = true) {
    let savedData = this.editForm.value;

    if (this.fichiers && this.fichiers.length) {
      savedData['fichier_count'] = this.fichiers.length;
      for (let i = 0; i < this.fichiers.length; i++) {
        savedData[`fichier${i}`] = this.fichiers[i];
      }
    }

    this.crudService.create(savedData)
    .subscribe(
      (data) => {
          this.newItem.emit(data);
          this.gestionMailService.onEmailCreated$.next(data);
          this.cdRef.detectChanges();
          this.editForm.markAsPristine();
          this.editForm.markAsUntouched();
          this.isLoading = false;
          this.notificationService.onSuccess('L\'enregistrement a été effectuer');
          this.ngOnInit();
          if (closeModalAfter) {
            this.onCloseModal();
          }
      }, error => {
        if (error.status == 500) {
            this.notificationService.onError('Impossible d\'éffectuer cette requête');
          }
        this.isLoading = false;
      }
    );

  }


  onCloseModal(result?: string) {
    if (this.editForm.dirty) {
      const confirmFunction = () => {
        this.close.emit(true);
      };
      this.notificationService.title = 'Modifications non enregistrées';
      this.notificationService.body = 'Voulez vous fermer cette fenêtre?';

      this.notificationService.titleMaxLength = 30;
      this.notificationService.backdrop = 0;

      this.notificationService.onConfirmation(confirmFunction);
      this.notificationService.titleMaxLength = 15;
      this.notificationService.backdrop = -1;
    } else {
      this.close.emit(true);
    }
  }
}
