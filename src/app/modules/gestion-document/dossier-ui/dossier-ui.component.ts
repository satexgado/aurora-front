import { GedElementFactory } from 'src/app/core/services/gestion-document/ged-element.factory';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CacheService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { tap, map, shareReplay, share, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EditComponent as DossierEditComponent} from '../dossier/edit/edit.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreMultipleFileComponent } from '../fichier/edit/edit.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ZenFichierUploadService } from '../fichier/fichier-upload.service';
import { ZenFichierBaseComponent } from '../fichier/fichier-base.component';
import { ItemSelectHelper, ResourceScrollableHelper } from 'src/app/shared/state';
import { SharedBaseComponent } from '../zen-document-share/shared.base.component';
import { ChangeDetectorRef } from '@angular/core';
import { Fichier, IFichier } from 'src/app/core/models/gestion-document/fichier.model';
import { Dossier, IDossier } from 'src/app/core/models/gestion-document/dossier.model';
import { FichierFactory } from 'src/app/core/services/gestion-document/fichier.factory';
import { DossierFactory } from 'src/app/core/services/gestion-document/dossier.factory';
import { IBase } from 'src/app/core/models/base.interface';
import { IFichierType } from 'src/app/core/models/gestion-document/fichier-type.model';
import { FichierTypeFactory } from 'src/app/core/services/gestion-document/fichier-type.factory';
import { Subscription } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Storage } from 'src/app/helpers/storage/storage';

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
  subscription: Subscription = new Subscription();
  lockedElement: IDossier;

  owner: 'all' | 'mine' | 'shared' = 'all';

  onChangeOwner(owner) {
    this.owner = owner;
    this.onloadContent();
  }

  clearDropdownFilter() {
    this.typeFilterSelectHelper.clearSelection();
    this.showFolder = false;
  }

  parentData: {relationName: string, relationId: number} = null;
  title = 'Acceuil';

  fichiersHelper: ResourceScrollableHelper;
  dossiersHelper: ResourceScrollableHelper;

  searchTerm: string ='';

  onSetSearchTerm() {
    if(this.fichiersHelper) {
      this.fichiersHelper.searchTerm = this.searchTerm;
    }
    if(this.dossiersHelper) {
      this.dossiersHelper.searchTerm = this.searchTerm;
    }
  }

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
  }

  //fichier Fonction
  onTransfertFichier;


  constructor(
    protected cacheService: CacheService,
    protected notificationService: NotificationService,
    public fichierService: ZenFichierUploadService,
    protected modalService: NgbModal,
    public storage: Storage,
    public http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    protected cdRef:ChangeDetectorRef,
    // protected fichierSharedBaseComponent: SharedBaseComponent,
    // protected dossierSharedBaseComponent: SharedBaseComponent

    ) {
    const fichierSharedBaseComponent = new SharedBaseComponent();
    fichierSharedBaseComponent.service = new FichierFactory();

    this.onTransfertFichier = (fichiers: IFichier[]) => {
      fichierSharedBaseComponent.onTransfertFichier(fichiers, this.dossier).subscribe(
        (data)=> {
          if((this.dossier && this.dossier.id != data) || (data && !this.dossier)) {
            fichiers.forEach(
              (fichier)=> {
                this.fichiersHelper.removeItem(fichier.id);
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
    this.subscription.add(
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
          // this.dossierAdditionalFilter = [{or: false, filters: [
          //   new Filter('isIns', true, 'eq'),
          // ]}];
          this.url = '/document/mon-espace';
          this.onloadContent();
        })
    );
    this.subscription.add(
      this.cacheService.get(
        'allTypeFichiers',
        new FichierTypeFactory().list(new QueryOptions().setSort([new Sort('libelle','ASC')])).pipe(
          shareReplay(1),
          map(data => data.data)
        ),
        1800000
      ).subscribe((data)=>this.typeFichiersList=data)
    );

    this.subscription.add(
      this.typeFilterSelectHelper.selectedItem$.subscribe(
        (data: any[])=> {
          if(this.fichiersHelper) {
            let temp = '';
            let i = 0;
            this.fichiersHelper.clearData();
            if(data && data.length) {
              data.forEach((item)=> {
                i++;
                temp += item.id+',';
              });
            }
           

            if(i)
            {
              temp = temp.substring(0, temp.length - 1);
            }else{
              temp = null;
            }

            if(!temp) {
              this.fichiersHelper.searchCustomFilterGroup = null;
            } else {
              this.fichiersHelper.searchCustomFilterGroup = {or: false, filters: [
                new Filter('type_id', temp, 'eq')
              ]};
            }

            this.fichiersHelper.loadData(1);
            
          }
        }
      )
    );
  }

  onChangeView(view : 'card' | 'list') {
    this.view = view;
    localStorage.setItem('gedViewType',view);
  }

  onloadContent() {
    if(this.dossier) {
      this.dossier_parent = [];
      this.lockedElement = null;
      this.fichierService.showFolderDetails.next(this.dossier);
      this.checkLockedFolderShit(this.dossier);
      if(this.lockedElement) {
        return this.onUnlockFolder();
      }
      this.onInitFolderContent();
      this.onSetBreadCrum(this.dossier);
      return;
    }
    this.onInitHomeContent();
  }

  checkLockedFolderShit(dossier: IDossier) {
    console.log(dossier);
    if(dossier.ged_element.bloquer && !dossier.is_user) {
      if(this.cacheService.hasValidCachedValue('unlocked_folder_'+dossier.id)) {
        return;
      }
      this.lockedElement = dossier;
    }

    if(dossier.dossier) {
      this.checkLockedFolderShit(dossier.dossier);
    }
  }

  onUnlockFolder() {
    const dossierSharedBaseComponent = new SharedBaseComponent();
    dossierSharedBaseComponent.service = new DossierFactory();
    dossierSharedBaseComponent.onCheckPassword(this.lockedElement).subscribe(
      (data: IDossier)=> {
        if(!data.ged_element.bloquer)  {
          this.cacheService.set('unlocked_folder_'+data.id,true,600000);
          this.onloadContent();
        }
      }
    );
  }

  onSetBreadCrum(dossier: IDossier) {
    this.dossier_parent.push(dossier);
    if(dossier.dossier) {
      this.onSetBreadCrum(dossier.dossier);
    }
  }

  onInitHomeContent() {

    this.dossiersHelper = new ResourceScrollableHelper(
      new DossierFactory(),  new QueryOptions(
        [...[
          {or: false, filters: [
            new Filter('owner_'+this.owner+'_home', true, 'eq'),
          ]}
        ], ... this.dossierAdditionalFilter],
        [
          'inscription', 'ged_element'
        ],
        undefined,
        undefined,
        [new Sort('libelle','ASC')])
    );
    this.dossiersHelper.withoutPaginate = true;
    this.dossiersHelper.loadData();
    
    this.fichiersHelper = new ResourceScrollableHelper(
      new FichierFactory(),  new QueryOptions(
        [...[
          {or: false, filters: [
            new Filter('owner_'+this.owner+'_home', true, 'eq'),
          ]}
        ], ... this.fichierAdditionalFilter],
        [
          'fichier_type', 'inscription', 'ged_element'
        ],
        undefined,
        undefined,
        [new Sort('libelle','ASC')])
    );

    this.fichiersHelper.loadData();

    
  }

  onInitFolderContent() {

    this.dossiersHelper = new ResourceScrollableHelper(
      new DossierFactory(),  new QueryOptions(
        [...[
          {or: false, filters: [
            new Filter('owner_'+this.owner+'_folder', this.dossier.id, 'eq')
          ]}
        ], ... this.dossierAdditionalFilter],
        [
          'inscription', 'ged_element'
        ],
        undefined,
        undefined,
        [new Sort('libelle','ASC')]
      )
    );
    this.dossiersHelper.withoutPaginate = true;
    this.dossiersHelper.loadData();
   
    this.fichiersHelper = new ResourceScrollableHelper(
      new FichierFactory(),  new QueryOptions(
        [...[
          {or: false, filters: [
            new Filter('owner_'+this.owner+'_folder', this.dossier.id, 'eq')
          ]}
        ], ... this.fichierAdditionalFilter],
        [
          'fichier_type', 'inscription', 'ged_element'
        ],
        undefined,
        undefined,
        [new Sort('libelle','ASC')]
      )
    );

    this.fichiersHelper.loadData();

    
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
        if(this.dossiersHelper) {
          this.dossiersHelper.addItem(data);
        }
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
    
    if(this.dossier) {
      instance.relation =  {
        name:'dossiers', id: this.dossier.id
      };
    }

    instance.fichierEmitter.subscribe(
      (data)=> {
        if(this.fichiersHelper) {
          this.fichiersHelper.addItem(data);
        }
        this.changeIndicator++;
      }
    )
  }

  onFileDropped(fichiers) {
    if(!this.dossier) {
      this.notificationService.onInfo('choose a folder');
      return ;
    }
    const files: any[] = fichiers;
    const service = new FichierFactory();
    for(let i = 0; i<files.length; i++) {
      let newFile = new Fichier();
      newFile.libelle = files[i].name;
      newFile.size = files[i].size;
      newFile.upload$ = service.upload(
        {
          libelle: files[i].name,
          fichier: files[i],
          relation_name: 'dossiers',
          relation_id: this.dossier.id
        }
      ).pipe(
        share()
        ,tap(
          (data)=> {
            // this.notificationService.onSuccess('L\'enregistrement a été effectuer', this.fichiers[i].name);
          }
        )
      );
      this.fichierService.newFichier.next(newFile);
      if(this.fichiersHelper) {
        this.fichiersHelper.addItem(newFile);
      }
      this.changeIndicator++;
    }
  }

  // Dragover listener
  @HostListener('dragenter', ['$event']) onDragOver(evt) {
    this.openFileModal();
    
  }

  onUpdateDossier(dossier:IDossier) {
    if(this.dossiersHelper) {
      this.dossiersHelper.updateItem(dossier);
    }
    this.changeIndicator++;
  }

  onDeleteDossier(dossier:IDossier) {
    this.dossiersHelper.removeItem(dossier.id);
    this.changeIndicator++;
  }

  onTransfertDossier(transfert: {dossier:IDossier, dossierId:number}) {
    if((this.dossier && this.dossier.id != transfert.dossierId) || (transfert.dossierId&&!this.dossier)) {
     this.dossiersHelper.removeItem(transfert.dossier.id);
    }
    this.changeIndicator++;
  }

  onUpdateFichier(fichier:IFichier) {
   this.fichiersHelper.updateItem(fichier);
    this.changeIndicator++;
  }

  onDeleteFichier(fichier:IFichier) {
    this.fichiersHelper.removeItem(fichier.id);
    this.changeIndicator++;
  }

  onTransfertSingleFichier(transfert: {fichier:IFichier, dossierId:number}) {
    if(this.dossier && this.dossier.id != transfert.dossierId) {
      this.fichiersHelper.removeItem(transfert.fichier.id);
    }
    this.changeIndicator++;
  }

  checkData() {
    if(this.fichiersHelper) {
      this.fichiersHelper.checkData();
    }
  }

  onDownloadMultipleFile() {

    if(! this.fichierSelectHelper.selectedItem.length) {
      return;
    }

    if(this.fichierSelectHelper.selectedItem.length < 2) {
      return this.fichierSelectHelper.selectedItem.forEach(((item:IFichier)=>window.open(item.fichier)));
    }


    const service = new FichierFactory();

    this.fichierService.compressingFile.next({
      upload: service.downloadMulti(
        this.fichierSelectHelper.selectedItem.map(((item:IFichier)=>item.id))
      ),
      name: "something something"
    });
  
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
