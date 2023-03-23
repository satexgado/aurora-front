import { Component, OnInit } from '@angular/core';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { EditableListComponent } from 'src/app/shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Event, NavigationCancel, NavigationEnd, NavigationError, Router } from '@angular/router';
import { CoordonneeDetailsService } from '../coordonnee-details.service'
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { ICrCoordonnee } from 'src/app/core/models/gestion-courrier/cr-coordonnee';
import { CacheService } from 'src/app/shared/services';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { Helper } from 'src/app/helpers/helper/helper';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { IMpMarche } from 'src/app/core/models/marche-public/marche.model';
import { IMpMarcheEtape } from 'src/app/core/models/marche-public/marche-etape.model';
import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';
import { MpMarcheTypeFactory } from 'src/app/core/services/marche-public/type-marche.model';
import { map, shareReplay } from 'rxjs/operators';
import { MpProcedureTypeFactory } from 'src/app/core/services/marche-public/type-procedure.model';
import { MpMarcheFactory } from 'src/app/core/services/marche-public/marche.model';

@Component({
  selector: 'app-cood-marche-public',
  templateUrl: 'cood-marche-public.component.html',
  styleUrls: ['./cood-marche-public.component.css'],
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

export class CoodMarchePublicComponent extends EditableListComponent implements OnInit {

  coordonneeID:number = 0;
  selectedMarche: IMpMarche;
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
    public structureService: StructureService,
    protected uiService: CoordonneeDetailsService,
    public route: ActivatedRoute,
    public helper2: Helper,
    protected modalService: NgbModal,
    private router: Router,
  ) {
    super(new ResourceScrollableHelper(new MpMarcheFactory()));
    this.modalService = modalService;
  }

  onChangeView(view : 'card' | 'list') {
    this.view = view;
    localStorage.setItem('marcheViewType',view);
  }

  ngOnInit() {
    this.uiService.marchePublicData$.subscribe(
      (marche)=> {
        this.selectedMarche = marche;
        this.selectedEtape = null;
        if(this.selectedMarche && this.selectedMarche.etapes && this.selectedMarche.etapes.length) {
          this.onSetSelectEtape(this.selectedMarche.etapes[0]);
        }
        if(marche && marche.structure) {
          this.structureService.singleData = null;
          this.structureService.show(marche.structure.id, true).subscribe();
        }
      }
    )

    this.route.parent.data.subscribe((data: { coordonnee: ICrCoordonnee }) =>
      {
        if((!data.coordonnee))
        {
          this.router.navigate(['/coordonnee']);
        }

        this.coordonneeID = data.coordonnee.id;
        const queryOptions = new QueryOptions(
          [
              {or: true, filters: [
                new Filter('CoordonneeId', data.coordonnee.id,  'eq'),
            ]}
          ],
          [
            'mp_type_marche', 'structure', 'mp_type_procedure.mp_type_procedure', 'mp_marche_etapes.fichiers', 'fournisseurs', 'partenaires'
          ],
          8,
          1,
          [new Sort('libelle','Asc')]
        );
        this.dataHelper = new ResourceScrollableHelper(new MpMarcheFactory(), queryOptions);
        super.ngOnInit();
      });

    this.router.events.subscribe((event: Event) => {
        switch (true) {
          case event instanceof NavigationEnd:
          case event instanceof NavigationCancel:
          case event instanceof NavigationError: {
            this.onLoadChild();
            break;
          }
          default: {
            break;
          }
        }
    });
    this.allMarcheTypes$.subscribe();
    this.allProcedureTypes$.subscribe();
    this.allCrStructures$.subscribe();
    this.onLoadChild();
  }

  onLoadChild() {
    if(this.route.firstChild) {
       return this.route.firstChild.data.subscribe()
    }
    this.uiService.marchePublicData = null;
  }

  onSetSelect(marche: IMpMarche = null) {
    this.uiService.marchePublicData = marche;
    this.router.navigate(['./', marche.id], {relativeTo: this.route});
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

  onToggleFileView() {
    this.viewFile = this.viewFile == 'list' ? 'preview' : 'list';
  }

  onSelectFile(fichier) {
    this.viewFile = 'preview';
    this.filePreview = fichier;
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

  onShowService(marche: IMpMarche) {
    if(marche.structure)  {
      return  this.helper2.modal.show('structure-preview-modal');
    }
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
}
