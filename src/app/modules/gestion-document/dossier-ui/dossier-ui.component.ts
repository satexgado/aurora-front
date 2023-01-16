import { Factory } from 'src/app/core/services/factory';
import { GedElementFactory } from 'src/app/core/services/gestion-document/ged-element.factory';
import { Component, Input, OnInit, ViewChildren } from '@angular/core';
import { CacheService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { tap, map, shareReplay } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, ReplaySubject } from 'rxjs';
import { EditComponent as DossierEditComponent} from '../dossier/edit/edit.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreMultipleFileComponent } from '../fichier/edit/edit.component';
import { ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';
import { ZenFichierUploadService } from '../fichier/fichier-upload.service';
import { ZenFichierBaseComponent } from '../fichier/fichier-base.component';
import { ItemSelectHelper } from 'src/app/shared/state';
import { SharedBaseComponent } from '../zen-document-share/shared.base.component';
import { ChangeDetectorRef } from '@angular/core';
import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';
import { Dossier, IDossier } from 'src/app/core/models/gestion-document/dossier.model';
import { FichierFactory } from 'src/app/core/services/gestion-document/fichier.factory';
import { DossierFactory } from 'src/app/core/services/gestion-document/dossier.factory';
import { IBase } from 'src/app/core/models/base.interface';
import { IFichierType } from 'src/app/core/models/gestion-document/fichier-type.model';
import { FichierTypeFactory } from 'src/app/core/services/gestion-document/fichier-type.factory';

@Component({
  selector: 'app-zen-dossier-ui',
  templateUrl: 'dossier-ui.component.html',
  providers: [ZenFichierBaseComponent, SharedBaseComponent]
})

export class ZenDossierUiComponent implements OnInit {

  dossierSelectHelper = new ItemSelectHelper();
  fichierSelectHelper = new ItemSelectHelper();
  typeFilterSelectHelper = new ItemSelectHelper();
  showFolder = false;

  clearDropdownFilter() {
    this.typeFilterSelectHelper.clearSelection();
    this.showFolder = false;
  }

  parentData: {relationName: string, relationId: number} = null;
  title = 'Acceuil';
  fichiers: IFichier[];
  dossier_enfant: IDossier[];
  searchTerm: string ='';
  is_loading_content = true;
  dossier: IDossier;
  fichierAdditionalFilter = [];
  dossierAdditionalFilter = [];
  folderNotFound = false;
  noAction =false;
  changeIndicator = 0;
  dossier_parent: IDossier[] = [];
  url = '/document/mon-espace';
  dossierFilter = [
    {or: false, filters:[
      new Filter('isIns', true, 'eq'),
      new Filter('noParent', true, 'eq'),
    ]},
  ];
  typeFichiersList: IFichierType[];
  view: 'card' | 'list' =  localStorage.getItem("gedViewType") ? <'card' | 'list'>localStorage.getItem("gedViewType"):  'card';

  @Input('dossier') set init(dossier: IDossier) {
    this.dossier = dossier;
    if(!dossier) {
      this.fichiers = [];
      this.dossier_enfant = [];
      return ;
    }
  }

  //fichier Fonction
  onTransfertFichier;


  constructor(
    protected cacheService: CacheService,
    protected notificationService: NotificationService,
    public fichierService: ZenFichierUploadService,
    protected modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    protected cdRef:ChangeDetectorRef,
    // protected fichierSharedBaseComponent: SharedBaseComponent,
    // protected dossierSharedBaseComponent: SharedBaseComponent

    ) {
    const fichierSharedBaseComponent = new SharedBaseComponent();
    fichierSharedBaseComponent.service = new FichierFactory();

    this.onTransfertFichier = (fichiers: IFichier[]) => {
      fichierSharedBaseComponent.onTransfertFichier(fichiers, this.dossier, this.dossierAdditionalFilter).subscribe(
        (data)=> {
          if(this.dossier && this.dossier.id != data) {
            fichiers.forEach(
              (fichier)=> {
                const index = this.fichiers.findIndex(element => element.id === fichier.id);
                this.fichiers.splice(index, 1);
              }
            )
            this.fichierSelectHelper.clearSelection();
            this.changeIndicator++;
          }
        }
      )
    }
  }

  ngOnInit() {
    this.route.data
      .subscribe((data: { dossier: IDossier }) => {
        this.dossier = data.dossier;
        this.dossier_parent = [];

        if(this.route.snapshot.paramMap.get('id') && !this.dossier) {
          this.folderNotFound = true;
          return;
        }

        this.folderNotFound = false;

        if(this.route.routeConfig?.data&&this.route.routeConfig?.data['folder_parent']) {
          this.route.parent.data.subscribe(
            (res)=> {
              let parent = res.data.parent as IBase;
              this.dossierAdditionalFilter = [{or: false, filters: [
                new Filter(this.route.routeConfig.data['folder_parent'], parent.id, 'eq')
              ]}];
              this.parentData = {
                relationId: +parent.id,
                relationName: this.route.routeConfig.data['folder_parent']
              };
              this.title = parent.libelle;
              this.dossierFilter = [
                {or: false, filters:[
                  new Filter(this.route.routeConfig.data['folder_parent'], parent.id, 'eq'),
                  new Filter('noParent', true, 'eq'),
                ]},
              ];
              this.url = res.data.url + '/dossier';
              // this.noAction = true;
              this.onloadContent();
            }
          )
          return ;
        }

        this.dossierFilter = [
          {or: false, filters:[
            new Filter('isIns', true, 'eq'),
            new Filter('noParent', true, 'eq'),
          ]},
        ];
        this.dossierAdditionalFilter = [{or: false, filters: [
          new Filter('isIns', true, 'eq'),
        ]}];
        this.url = '/document/mon-espace';
        this.onloadContent();
      });
      this.cacheService.get(
        'allTypeFichiers',
        new FichierTypeFactory().list(new QueryOptions().setSort([new Sort('libelle','ASC')])).pipe(
          shareReplay(1),
          map(data => data.data)
        ),
        1800000
      ).subscribe((data)=>this.typeFichiersList=data);
  }

  onChangeView(view : 'card' | 'list') {
    this.view = view;
    localStorage.setItem('gedViewType',view);
  }

  onloadContent() {
    if(this.dossier) {
      this.fichierService.showFolderDetails.next(this.dossier)
      this.onInitFolderContent();
      this.onSetBreadCrum(this.dossier);
      return;
    }
    this.onInitHomeContent();
  }

  onSetBreadCrum(dossier: IDossier) {
    this.dossier_parent.push(dossier);
    if(dossier.dossier) {
      this.onSetBreadCrum(dossier.dossier);
    }
  }

  onInitHomeContent() {
    this.is_loading_content = true;
    this.fichiers = [];
    const dossierService = new DossierFactory();
    let observable = [];

    observable.push(
      dossierService.list(
        new QueryOptions(
          [...[
            {or: false, filters: [
              new Filter('noParent', true, 'eq'),
            ]}
          ], ... this.dossierAdditionalFilter],
          [
            'inscription', 'ged_element'
          ],
          undefined,
          undefined,
          [new Sort('libelle','ASC')]
        )
      ).pipe(
        (tap(
          (data)=> {
            this.dossier_enfant = data.data;
          }
        ))
      )
    )

    forkJoin(observable).subscribe(
      ()=> {
        this.is_loading_content = false;
      }
    );
  }

  onInitFolderContent() {
    this.is_loading_content = true;
    const fichierService = new FichierFactory();
    const dossierService = new DossierFactory();
    let observable = [];
    observable.push(
      fichierService.list(
        new QueryOptions(
          [...[
            {or: false, filters: [
              new Filter('dossier_id', this.dossier.id, 'eq')
            ]}
          ], ... this.fichierAdditionalFilter],
          [
            'fichier_type', 'inscription', 'ged_element'
          ],
          undefined,
          undefined,
          [new Sort('libelle','ASC')]
        )
      ).pipe(
        (tap(
          (data)=> {
            this.fichiers = data.data;
            this.cdRef.detectChanges();
          }
        ))
      )
    );

    observable.push(
      dossierService.list(
        new QueryOptions(
          [...[
            {or: false, filters: [
              new Filter('dossier_id', this.dossier.id, 'eq')
            ]}
          ], ...this.dossierAdditionalFilter],
          [
            'inscription', 'ged_element'
          ],
          undefined,
          undefined,
          [new Sort('libelle','ASC')]
        )
      ).pipe(
        (tap(
          (data)=> {
            this.dossier_enfant = data.data;
          }
        ))
      )
    )

    forkJoin(observable).subscribe(
      ()=> {
        this.is_loading_content = false;
      }
    );
  }

  onShowCreateFolderForm() {
    const modalRef = this.modalService.open(DossierEditComponent, { size: 'lg', centered: true, backdrop: 'static' });
    const instance = modalRef.componentInstance as DossierEditComponent;
    instance.title = `Creer un dossier`;
    if(this.dossier) {
      let item = new Dossier();
      item.dossier_id = this.dossier.id;
      instance.item = item;
      instance.dossierId = this.dossier.id;
    }
    instance.newItem.subscribe(
      (data: IDossier) => {
        if(!this.dossier_enfant) {
          this.dossier_enfant = [];
        }
        this.dossier_enfant.unshift(data);
        this.changeIndicator++;
        if(!this.parentData) {return;}
        const service = new GedElementFactory();
        service.attachAffectation(data.ged_element.id, this.parentData.relationName, this.parentData.relationId).subscribe();
      }
    );
  }

  onAfterSaveDossier(dossier: IDossier) {
    if(!this.parentData) {return;}
    const service = new GedElementFactory();
    service.attachAffectation(dossier.ged_element.id, this.parentData.relationName, this.parentData.relationId).subscribe();
  }

  onShowUpdateForm() {
    const modalRef = this.modalService.open(DossierEditComponent, { size: 'lg', centered: true, backdrop: 'static' });
    const instance = modalRef.componentInstance as DossierEditComponent;
    instance.title = `Modifier: ${this.dossier?.libelle}`;
    instance.item = this.dossier;
    instance.isUpdating = true;
    instance.newItem.subscribe(
      (data: IDossier) => {
        this.dossier = data;
        this.changeIndicator++;
      }
    );
  }

  openModal(content) {
    this.modalService.open(content, { size: 'lg', centered: true,  backdrop: 'static' });
  }

  openFileModal() {
    const modalRef = this.modalService.open(StoreMultipleFileComponent, { size: 'lg', centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as StoreMultipleFileComponent;
    instance.settingDossierFilter = this.dossierAdditionalFilter;
    if(this.dossier) {
      instance.dossierId = this.dossier.id;
      instance.noDossierSelect = true;
      instance.fichierEmitter.subscribe(
        (data)=> {
          if(!this.fichiers) {
            this.fichiers = [];
          }
          this.fichiers.unshift(data);
          this.changeIndicator++;
        }
      )
    }
  }

  onUpdateDossier(dossier:IDossier) {
   this.dossier_enfant = this.dossier_enfant.map(element => {
      if (element.id === dossier.id ) {
          element = dossier;
      }
      return element;
    });
    this.changeIndicator++;
  }

  onDeleteDossier(dossier:IDossier) {
    const index = this.dossier_enfant.findIndex(element => element.id === dossier.id);
    this.dossier_enfant.splice(index, 1);
    this.changeIndicator++;
  }

  onTransfertDossier(transfert: {dossier:IDossier, dossierId:number}) {
    if((this.dossier && this.dossier.id != transfert.dossierId) || (transfert.dossierId&&!this.dossier)) {
      const index = this.dossier_enfant.findIndex(element => element.id === transfert.dossier.id);
      this.dossier_enfant.splice(index, 1);
    }
    this.changeIndicator++;
  }

  onUpdateFichier(fichier:IFichier) {
   this.fichiers = this.fichiers.map(element => {
      if (element.id === fichier.id ) {
          element = fichier;
      }
      return element;
    });
    this.changeIndicator++;
  }

  onDeleteFichier(fichier:IFichier) {
    const index = this.fichiers.findIndex(element => element.id === fichier.id);
    this.fichiers.splice(index, 1);
    this.changeIndicator++;
  }

  onTransfertSingleFichier(transfert: {fichier:IFichier, dossierId:number}) {
    if(this.dossier && this.dossier.id != transfert.dossierId) {
      const index = this.fichiers.findIndex(element => element.id === transfert.fichier.id);
      this.fichiers.splice(index, 1);
    }
    this.changeIndicator++;
  }
}
