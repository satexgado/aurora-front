import { ChooseMultiItem2Component } from './../../choose-item/multi2/choose-multi-item2.component';
import { MpMarcheEtapeFactory } from './../../../core/services/marche-public/marche-etape.model';
import { BasicStoreMultipleFileComponent } from 'src/app/modules/gestion-document/fichier/store-fichier/edit.component';
import { MpMarcheFactory } from 'src/app/core/services/marche-public/marche.model';
import { Component, OnInit} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditComponent } from './edit/edit.component';
import { Helper } from 'src/app/helpers/helper/helper';
import { AppTitleService, CacheService } from 'src/app/shared/services';
import { EditableListComponent } from 'src/app/shared';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { QueryOptions, Filter, Sort } from 'src/app/shared/models/query-options';
import { BehaviorSubject, of } from 'rxjs';
import { IMpMarche } from 'src/app/core/models/marche-public/marche.model';
import { IMpMarcheEtape } from 'src/app/core/models/marche-public/marche-etape.model';
import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MpMarcheTypeFactory } from 'src/app/core/services/marche-public/type-marche.model';
import { map, shareReplay } from 'rxjs/operators';
import { MpProcedureTypeFactory } from 'src/app/core/services/marche-public/type-procedure.model';
import { MpMarcheEtape } from '../../../core/models/marche-public/marche-etape.model';
import { Collection, collect } from 'src/app/shared/models/collection-master/Collection';
import { CrCoordonneeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee';
import { ICrCoordonnee } from 'src/app/core/models/gestion-courrier/cr-coordonnee';
@Component({
  selector: 'app-marche',
  templateUrl: './marche.component.html',
  styleUrls: [
    './marche.component.css'
  ],
  styles: [`
    cdk-drop {
      display: flex;
      flex-direction: column;
      max-height: 50px;
      overflow: auto;
    }
  `],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class MarcheComponent extends EditableListComponent implements OnInit {

  editModal = EditComponent;
  modalData: IMpMarche;
  parentData: {relationName: string,relationId: number};
  nomEtape: string;
  newEtapeLoading: boolean;
  selectedEtape: IMpMarcheEtape;
  filePreview: IFichier;
  viewFile: 'preview' | 'list' = 'preview';
  loading;
  view: 'card' | 'list' =  localStorage.getItem("marcheViewType") ? <'card' | 'list'>localStorage.getItem("marcheViewType"):  'card';

  constructor(
    protected cacheService: CacheService,
    protected titleservice: AppTitleService,
    public helper2: Helper,
    public structureService: StructureService,
    protected modalService: NgbModal) {
    super(new ResourceScrollableHelper(new MpMarcheFactory()));
    this.titleservice.setTitle('mes Marches')
    this.modalService = modalService;
  }

  onChangeView(view : 'card' | 'list') {
    this.view = view;
    localStorage.setItem('marcheViewType',view);
  }

  ngOnInit() {
    this.cacheService.get('affectation-parent').subscribe(
      (data: {relationName: string,relationId: number})=>{
        const queryOptions = new QueryOptions(
          [
              {or: false, filters:[new Filter('isIns', true, 'eq')]},
              {or: false, filters: [new Filter(`${data.relationName}_by_id`, data.relationId, 'eq')]}
          ],
          ['mp_type_marche', 'structure', 'mp_type_procedure', 'mp_marche_etapes.fichiers', 'fournisseurs', 'partenaires'],
          8,
          1,
          [new Sort('libelle','Asc')]
        );
        this.parentData = data;
        this.dataHelper = new ResourceScrollableHelper(new MpMarcheFactory(), queryOptions);
        super.ngOnInit();
        this.allMarcheTypes$.subscribe();
      this.allProcedureTypes$.subscribe();
      this.allCrStructures$.subscribe();
      },
      ()=>{
        super.ngOnInit();
        this.dataHelper.sortColumn = 'libelle';
        this.dataHelper.sortDirection = 'Asc';
        this.dataHelper.relations = ['mp_type_marche', 'structure', 'mp_type_procedure.mp_type_procedure', 'mp_marche_etapes.fichiers', 'fournisseurs', 'partenaires'];
        this.allMarcheTypes$.subscribe();
      this.allProcedureTypes$.subscribe();
      this.allCrStructures$.subscribe();
      }
    )


  }

  onShowCreateForm(item?, modal = this.editModal) {
    super.onShowCreateForm(item).subscribe(
       (data:IMpMarche)=>{
         if(!this.parentData)  {return;}
         const service = new MpMarcheFactory();
         service.attachAffectation(data.id, this.parentData.relationName+'s', this.parentData.relationId).subscribe();
       }
    )
    return of(true);
 }

 openModal(content, data: IMpMarche) {
  this.modalData = data;
  this.modalService.open(content, { size: 'lg', centered: true,  backdrop: 'static' });
  }

  onSetSelect(data: IMpMarche){
    this.modalData = data;
    this.selectedEtape = null;
    if(this.modalData && this.modalData.etapes && this.modalData.etapes.length) {
      this.onSetSelectEtape(this.modalData.etapes[0]);
    }
    if(data && data.structure) {
      this.structureService.singleData = null;
      this.structureService.show(data.structure.id, true).subscribe();
    }
  }

  onSetSelectEtape(etape: IMpMarcheEtape) {
    this.selectedEtape = etape;
    if(etape.fichiers && etape.fichiers.length) {
      this.filePreview = etape.fichiers[0];
      this.viewFile = 'preview';
    } else {
      this.filePreview = null;
      this.viewFile = 'list';
    }
  }

  openFileModal() {
    const modalRef = this.modalService.open(BasicStoreMultipleFileComponent, { size: 'lg', centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as BasicStoreMultipleFileComponent;
    if(this.selectedEtape) {
      instance.relation_name = 'mp_marche_etapes';
      instance.relation_id = this.selectedEtape.id;
      instance.fichierEmitter.subscribe(
        (data)=> {

          if(!this.selectedEtape.fichiers) {
            this.selectedEtape.fichiers = [];
          }
          this.selectedEtape.fichiers.unshift(data);
        }
      )
    }
  }

  onToggleFileView() {
    this.viewFile = this.viewFile == 'list' ? 'preview' : 'list';
  }

  onSelectFile(fichier) {
    this.viewFile = 'preview';
    this.filePreview = fichier;
  }

  quickCreation() {
    if(!this.nomEtape) {
      return;
    }

    this.newEtapeLoading = true;

    let etape = new MpMarcheEtape();
    etape.libelle = this.nomEtape;
    etape.marche_id = this.modalData.id;
    etape.position = this.modalData.etapes && this.modalData.etapes.length ? this.modalData.etapes.length : 0;
    const service = new MpMarcheEtapeFactory();
    service.create(etape).subscribe(
      (data)=>{
        this.nomEtape = '';
        this.newEtapeLoading = false;
        if(data.marche_id == this.modalData.id) {
          this.modalData.etapes.push(data);
        }
      }
    )
  }

  quickSave(item, libelle) {
    if(item.libelle == libelle || !libelle) {
      item.showForm = false;
      return;
    }

    // this.loading = true;
    const service = new MpMarcheEtapeFactory();
    service.update({
      id: item.id,
      libelle: libelle
    }).subscribe(
      ()=>{
        // item.showForm = false;
        // item.libelle = libelle;
        // this.loading = false;
      }
    );

    item.showForm = false;
    item.libelle = libelle;
  }

  onShowQuickForm(item) {
    if(item.showForm) {
      return;
    }
    item.showForm = true;
    item.formLibelle = item.libelle
  }

  onShowService(marche: IMpMarche) {
    if(marche.structure)  {
      return  this.helper2.modal.show('structure-preview-modal');
    }
  }

  drop(event: CdkDragDrop<IMpMarcheEtape[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      let mapped = event.container.data.map((v, i)=> {
        return {
          id: v.id,
          position: i
        }
      });

      let service = new MpMarcheEtapeFactory();
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

  onDeleteEtape(item: IMpMarcheEtape) {
    let _result$ = new BehaviorSubject<boolean>(false);
    const result$ = _result$.asObservable();
    const libelle =  item.libelle;
    this.notificationService.title = 'Suppréssion';
    this.notificationService.body = 'Êtes-vous sûr(e) de vouloir supprimer?' + ' ' + item.libelle;

    const cancelDelete = (index: number = 0) => {
      const service = new MpMarcheEtapeFactory();
      service.restore(item.id).subscribe(
          (data) => {
            this.modalData.etapes.splice(index, 0, data);
            this.notificationService.onInfo("La suppression a été annuler");
          }, () => {
          }
        );
    };

    const confirm = () => {
      const service = new MpMarcheEtapeFactory();
      let index = this.modalData.etapes.findIndex(d => d.id === item.id); //find index in your array
      service.delete(item.id).subscribe(
        () => {
          this.notificationService.onCancel(()=>{cancelDelete(index)}, "L'élément '"+libelle+"' a été supprimé" ,'Suppression' , 'success', 'Annuler la suppresion');
        }, () => {
          this.notificationService.onInfo('l\'élément est utilisé');
        }
      );
      this.modalData.etapes.splice(index, 1);//remove element from array
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


  // Filter Zone
  showClose;
  showOpen = true;

  filters = {
    type_marches_id: [],
    type_procedures_id: [],
    service_contractants_id: [],
  };

  is_advance_filter = false;
  multiParameter2 = {
    singleSelection: false,
    selectAllText: 'Tout selectionner',
    unSelectAllText: 'Tout deselectionner',
    itemsShowLimit: 5,
    labelKey: 'libelle',
    enableSearchFilter: true,
    tagToBody: false
  };

  cancelFilter() {
    this.filters = {
      type_marches_id: [],
      type_procedures_id: [],
      service_contractants_id: [],
    };
    this.doFilter();
  }

  doFilter() {
    this.is_advance_filter = false;
    let filters = {or: false, filters:[]};

    Object.entries(this.filters).forEach(
      ([key, value]) => {
        if(value && value.length) {
          this.is_advance_filter = true;
          filters.filters.push(
            new Filter(key,
              value.map(el=>el.id).toString(),
            'eq')
          )
        }
      }
    );

    this.dataHelper.searchCustomFilterGroup = filters.filters.length ? filters : null;
    this.dataHelper.loadData(1);
  }

  onSwitchCloseFilter() {
    this.showClose = !this.showClose;
    this.onDoCloseOpenFilter();
  }

  onSwitchOpenFilter() {
    this.showOpen = !this.showOpen;
    this.onDoCloseOpenFilter();
  }

  onDoCloseOpenFilter() {
    if(this.showClose && this.showOpen) {
      this.dataHelper.query = [];
    } else if(this.showOpen && !this.showClose) {
      this.dataHelper.query = [
        {or: false, filters:[new Filter('is_closed', 0, 'eq')]},
      ];
    } else if (this.showClose && !this.showOpen) {
      this.dataHelper.query = [
        {or: false, filters:[new Filter('is_closed', 1, 'eq')]},
      ];
    } else {
      this.dataHelper.query = [
        {or: false, filters:[new Filter('id', '', 'eq')]},
      ];
    }
    this.dataHelper.loadData(1);
  }

  dependancies = {
    type_procedures: [],
    structures: [],
    type_marches: [],
  };

  dependanciesLoading = {
    type_procedures: false,
    structures: false,
    type_marches: false,
  };

  protected readonly allMarcheTypes$ = new MpMarcheTypeFactory().list().pipe(
    shareReplay(1),
    map(data => data.data)
  );

  protected readonly allProcedureTypes$ = new MpProcedureTypeFactory().list().pipe(
    shareReplay(1),
    map(data => data.data)
  );

  protected readonly allCrStructures$ = new StructureService().all();

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', modalDialogClass: 'modal-right modal-right-100vh', }).result.then((result) => {

    }, (reason) => {

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

  public getTypeProcedures(): void {
    if(this.dependancies.type_procedures && this.dependancies.type_procedures.length) {
      return;
    }
    this.dependanciesLoading.type_procedures = true;
    const service = new MpProcedureTypeFactory();
    service.list(new QueryOptions(
      [
        {or: true, filters:[new Filter('no_child', 1, 'eq')]},
      ]
    ).setSort([new Sort('libelle','ASC')]).setIncludes(['mp_type_procedure'])).pipe(
      shareReplay(1),
      map(data => data.data)
    ).subscribe((type_procedures: any) => {
      this.dependancies.type_procedures = type_procedures;
      this.dependanciesLoading.type_procedures = false;
    });
  }

  public getTypeMarches(): void {
    if(this.dependancies.type_marches && this.dependancies.type_marches.length) {
      return;
    }
    this.dependanciesLoading.type_marches = true;
    const service = new MpMarcheTypeFactory();
    service.list(new QueryOptions().setSort([new Sort('libelle','ASC')])).pipe(
      shareReplay(1),
      map(data => data.data)
    ).subscribe((type_marches: any) => {
      this.dependancies.type_marches = type_marches;
      this.dependanciesLoading.type_marches = false;
    });
  }

  onDeleteFichier(fichier:IFichier) {
    const index = this.selectedEtape.fichiers.findIndex(element => element.id === fichier.id);
    this.selectedEtape.fichiers.splice(index, 1);
  }

  // Filter Zone End

  onSetPartenaires(marche: IMpMarche)
  {
    if(!marche) {
      this.notificationService.onError("le marche n'a pas été trouvé");
      return;
    }
    const modalRef = this.modalService.open(ChooseMultiItem2Component,{  centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as ChooseMultiItem2Component;
    instance.name = 'Partenaires';
    instance.isLoading = true;
    const service = new MpMarcheFactory();
    let partenairesCollected;
    instance.isLoading=true;

    if(marche.partenaires && marche.partenaires.length) {
      partenairesCollected = marche.partenaires;
    } else {
      partenairesCollected = [];
    }

    instance.preselected = partenairesCollected.map(element => element.id);
    const allCoordonnee$ = new CrCoordonneeFactory().list(new QueryOptions().setSort([new Sort('libelle', 'asc')]))
    .pipe(shareReplay(1), map(data => {
      instance.isLoading = false;
      return data.data;
    }));
    instance.dataSource$ = allCoordonnee$;

        instance.multipleItemChoosen.subscribe(
          (partenaires: number[]) => {

            allCoordonnee$.subscribe(
              (data)=>{
                marche.partenaires = data.filter(el=> partenaires.includes(el.id));
              }
            )

            service.setAffectations(marche.id, {
              partenaires : partenaires
            }).subscribe((res: {detached , attached})=>{
              allCoordonnee$.subscribe(
                (data)=> {
                  let allEpingles = collect(data);
                   // Sometimes server send object insteads of array
                  if(res.detached instanceof Object)
                  {
                    res.detached = Object.values(res.detached);
                  }

                  if(res.attached instanceof Object)
                  {
                    res.attached = Object.values(res.attached);
                  }

                  let attached = allEpingles.whereIn('id', res.attached).all();
                  let detached = allEpingles.whereIn('id', res.detached).all();

                  if(attached.length)
                  {
                    attached.forEach(element => {
                      this.notificationService.body = this.notificationService.body+' "'+element.libelle+'",'
                    });
                    this.notificationService.body = this.notificationService.body.substring(0, this.notificationService.body.length - 1)
                    this.notificationService.onInfo(this.notificationService.body, 'Partenaires ajoutés ');
                    this.notificationService.body = '';
                  }

                  if(detached.length)
                  {
                    detached.forEach(element => {
                      this.notificationService.body = this.notificationService.body+' "'+element.libelle+'",'
                    });
                    this.notificationService.body = this.notificationService.body.substring(0, this.notificationService.body.length - 1)
                    this.notificationService.onInfo(this.notificationService.body, 'Partenaires retirés');
                    this.notificationService.body = '';
                  }
                }
              )
            },()=>{

            })
        })
  }

  onSetFournisseurs(marche: IMpMarche)
  {
    if(!marche) {
      this.notificationService.onError("le marche n'a pas été trouvé");
      return;
    }
    const modalRef = this.modalService.open(ChooseMultiItem2Component,{  centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as ChooseMultiItem2Component;
    instance.name = 'Fournisseurs';
    instance.isLoading = true;
    const service = new MpMarcheFactory();
    let fournisseursCollected;
    instance.isLoading=true;

    if(marche.fournisseurs && marche.fournisseurs.length) {
      fournisseursCollected = marche.fournisseurs;
    } else {
      fournisseursCollected = [];
    }

    instance.preselected = fournisseursCollected.map(element => element.id);
    const allCoordonnee$ = new CrCoordonneeFactory().list(new QueryOptions().setSort([new Sort('libelle', 'asc')]))
    .pipe(shareReplay(1), map(data => {
      instance.isLoading = false;
      return data.data;
    }));
    instance.dataSource$ = allCoordonnee$;

        instance.multipleItemChoosen.subscribe(
          (fournisseurs: number[]) => {

            allCoordonnee$.subscribe(
              (data)=>{
                marche.fournisseurs = data.filter(el=> fournisseurs.includes(el.id));
              }
            )

            service.setAffectations(marche.id, {
              fournisseurs : fournisseurs
            }).subscribe((res: {detached , attached})=>{
              allCoordonnee$.subscribe(
                (data)=> {
                  let allEpingles = collect(data);
                   // Sometimes server send object insteads of array
                  if(res.detached instanceof Object)
                  {
                    res.detached = Object.values(res.detached);
                  }

                  if(res.attached instanceof Object)
                  {
                    res.attached = Object.values(res.attached);
                  }

                  let attached = allEpingles.whereIn('id', res.attached).all();
                  let detached = allEpingles.whereIn('id', res.detached).all();

                  if(attached.length)
                  {
                    attached.forEach(element => {
                      this.notificationService.body = this.notificationService.body+' "'+element.libelle+'",'
                    });
                    this.notificationService.body = this.notificationService.body.substring(0, this.notificationService.body.length - 1)
                    this.notificationService.onInfo(this.notificationService.body, 'Fournisseurs ajoutés ');
                    this.notificationService.body = '';
                  }

                  if(detached.length)
                  {
                    detached.forEach(element => {
                      this.notificationService.body = this.notificationService.body+' "'+element.libelle+'",'
                    });
                    this.notificationService.body = this.notificationService.body.substring(0, this.notificationService.body.length - 1)
                    this.notificationService.onInfo(this.notificationService.body, 'Fournisseurs retirés');
                    this.notificationService.body = '';
                  }
                }
              )
            },()=>{

            })
        })
  }
}
