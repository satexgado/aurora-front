import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { interval, of, Subject, Subscription } from 'rxjs';
import { map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { ICrCourrierEntrant } from 'src/app/core/models/gestion-courrier/cr-courrier-entrant';
import { CrCoordonneeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee';
import { CrCourrierEntrantFactory } from 'src/app/core/services/gestion-courrier/cr-courrier-entrant';
import { CrNatureFactory } from 'src/app/core/services/gestion-courrier/cr-nature';
import { CrTypeFactory } from 'src/app/core/services/gestion-courrier/cr-type';
import { CrUrgenceFactory } from 'src/app/core/services/gestion-courrier/cr-urgence';
import { UserFactory } from 'src/app/core/services/user.factory';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { EditableListComponent } from 'src/app/shared';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { AppTitleService, CacheService } from 'src/app/shared/services';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { EditComponent as CourrierEntrantEditFormComponent} from '../../courrier-entrant/edit/edit.component'

import { Helper } from 'src/app/helpers/helper/helper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {EditComponent} from '../../courrier-entrant/edit/edit.component';
import { ICrCourrier } from 'src/app/core/models/gestion-courrier/cr-courrier';
import { ActivatedRoute, Event, NavigationCancel, NavigationEnd, NavigationError, Router } from '@angular/router';
import { CrCourrierFactory } from 'src/app/core/services/gestion-courrier/cr-courrier';
import { ClotureCourrierEditComponent } from '../../courrier-entrant/cloture-edit/edit.component';
import { AffectationCourrierEditComponent } from '../../courrier-entrant/affectation/affectation.component';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { ICrCoordonnee } from 'src/app/core/models/gestion-courrier/cr-coordonnee';
import { CourrierUiService } from '../courrier-ui.service';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { ICrReaffectation } from 'src/app/core/models/gestion-courrier/cr-reaffectation';
import { CrReaffectationFactory } from 'src/app/core/services/gestion-courrier/cr-reaffectation';

@Component({
  selector: 'app-courrier-entrant-ui',
  templateUrl: 'entrant-ui.component.html',
  styleUrls: [
    './entrant-ui.component.css'
  ],
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

export class CourrierEntrantUiComponent extends EditableListComponent implements OnInit, OnDestroy {

  @ViewChild('scrollContainer')
  scrollContainer: ElementRef;

  @ViewChild('expediteurExterne')
  expediteurExterneModul;

  view: 'card' | 'list' =  localStorage.getItem("courrierViewType") ? <'card' | 'list'>localStorage.getItem("courrierViewType"):  'card';
  fragment: string;
  showClose;
  showOpen = true;
  editModal = EditComponent;
  selectedCourrier: ICrCourrierEntrant;
  parentData: {relationName: string,relationId: number} = null;
  externe = 1;
  expediteur: ICrCoordonnee;
  subscription: Subscription = new Subscription();

  // last entrant
  TASK_REFRESH_INTERVAL_MS = 30000;
  private readonly autoRefresh$ = interval(this.TASK_REFRESH_INTERVAL_MS).pipe(
    startWith(0)
  );

  lastEntrant$;
  reaffectation$;
  // last entrant

  onValidateReaffectation( reaffectation: ICrReaffectation, confirmation = true ) {
    if(confirmation)  {
      reaffectation.confirmation = 1;
      reaffectation.annulation = 0;
    } else {
      reaffectation.confirmation = 0;
      reaffectation.annulation = 1;
    }

    const service = new CrReaffectationFactory();
    service.update(reaffectation).subscribe(
      (data)=> {
        reaffectation = data;
      }
    );
    

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  filters = {
    types_id: [],
    structures_id: [],
    suivi_pars_id: [],
    natures_id: [],
    urgences_id: [],
    expediteur_externes_id: [],
    expediteur_internes_id: [],
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
      types_id: [],
      structures_id: [],
      suivi_pars_id: [],
      natures_id: [],
      urgences_id: [],
      expediteur_externes_id: [],
      expediteur_internes_id: [],
    };
    this.doFilter();
  }

  doFilter() {
    this.dataHelper.clearData();
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
    this.dataHelper.clearData();
    if(this.showClose && this.showOpen) {
      this.dataHelper.query = [
        {or: false, filters:[new Filter('IsIns2', 1, 'eq')]},
        {or: false, filters:[new Filter('externe', this.externe, 'eq')]},
      ];
    } else if(this.showOpen && !this.showClose) {
      this.dataHelper.query = [
        {or: false, filters:[new Filter('IsIns2', 1, 'eq')]},
        {or: false, filters:[new Filter('is_closed', 0, 'eq')]},
        {or: false, filters:[new Filter('externe', this.externe, 'eq')]},
      ];
    } else if (this.showClose && !this.showOpen) {
      this.dataHelper.query = [
        {or: false, filters:[new Filter('IsIns2', 1, 'eq')]},
        {or: false, filters:[new Filter('is_closed', 1, 'eq')]},
        {or: false, filters:[new Filter('externe', this.externe, 'eq')]},
      ];
    } else {
      this.dataHelper.query = [
        {or: false, filters:[new Filter('IsIns2', 1, 'eq')]},
        {or: false, filters:[new Filter('id', '', 'eq')]},
        {or: false, filters:[new Filter('externe', this.externe, 'eq')]},
      ];
    }
    this.dataHelper.loadData(1);
  }

  dependancies = {
    types: [],
    structures: [],
    users: [],
    natures: [],
    urgences: [],
    coordonnees: [],
  };

  dependanciesLoading = {
    types: false,
    structures: false,
    users: false,
    natures: false,
    urgences: false,
    coordonnees: false,
  };

  constructor(
    protected cacheService: CacheService,
    protected titleservice: AppTitleService,
    public structureService: StructureService,
    protected uiService: CourrierUiService,
    public authService: AuthService,
    public route: ActivatedRoute,
    public helper2: Helper,
    private router: Router,
    protected modalService: NgbModal) {
    super(new ResourceScrollableHelper(new CrCourrierEntrantFactory()));
    this.titleservice.setTitle('mes CourrierEntrants')
    this.modalService = modalService;
  }

  checkData() {
    if(this.dataHelper.hasMoreData) {
      this.dataHelper.loadData();
    }
  }

  onChangeView(view : 'card' | 'list') {
    this.view = view;
    localStorage.setItem('courrierViewType',view);
  }

  onShowCourrierExpediteur(courrier: ICrCourrierEntrant) {
    if(courrier.provenance && (!courrier.provenance.externe))  {
      return  this.helper2.modal.show('structure-preview-modal');
    }
    this.expediteur = courrier.expediteur_externe;
    this.open(this.expediteurExterneModul);
  }

  ngOnInit() {

    if(!(this.route.routeConfig?.data&&this.route.routeConfig?.data?.externe)) {
      this.externe = this.route.routeConfig?.data?.externe;
    }

    const courrierEntrantService = new CrCourrierEntrantFactory();
    this.lastEntrant$ = this.autoRefresh$.pipe(
      switchMap(() => courrierEntrantService.list(
        new QueryOptions(
          [
              {or: false, filters:[new Filter('externe', this.externe, 'eq')]},
            {or: false, filters:[new Filter('IsIns2', 1, 'eq')]},
          ],
          [],
          6,
          1,
          [new Sort('updated_at','DESC')]
      )).pipe(map(data=>data.data)))
    );

    const crReaffectationService = new CrReaffectationFactory();
    this.reaffectation$ = this.autoRefresh$.pipe(
      switchMap(() => crReaffectationService.list(
        new QueryOptions(
          [
            {or: false, filters:[new Filter('IsForIns', 1, 'eq'), new Filter(this.externe ? 'HasEntrant' : 'HasInterne', 1, 'eq')]},
          ],
        ).setSort([new Sort('created_at','DESC')])
      ).pipe(map(data=>data.data)))
    );

    this.subscription.add(
      this.uiService.courrierEntrantData$.subscribe(
        (courrier)=> {
          this.selectedCourrier = courrier;
          if(courrier) {
            this.selectedCourrier['showingTask'] = false;
          }
          if(courrier && courrier.provenance && (!courrier.provenance.externe))  {
            this.structureService.singleData = null;
            this.structureService.show(courrier.expediteur_interne.id, true).subscribe();
          }
        }
      )
    )

    this.subscription.add(
      this.cacheService.get('affectation-parent').subscribe(
        (data: {relationName: string,relationId: number})=>{
          const queryOptions = new QueryOptions(
            [
                {or: false, filters:[new Filter('isIns2', true, 'eq')]},
                {or: false, filters: [new Filter(`${data.relationName}_by_id`, data.relationId, 'eq')]},
                {or: false, filters:[new Filter('externe', this.externe, 'eq')]},
            ],
            [
              'cr_courrier.cr_statut',
              'cr_courrier.cr_type',
              'cr_courrier.cr_nature',
              'cr_courrier.cr_urgence',
              'cr_courrier.cr_cloture',
              'cr_provenance'
            ],
            8,
            1,
            [new Sort('updated_at','DESC')]
          );
          this.parentData = data;
          this.dataHelper = new ResourceScrollableHelper(new CrCourrierEntrantFactory(), queryOptions);
          super.ngOnInit()
        },
        ()=>{
          this.dataHelper.query = [
            {or: false, filters:[new Filter('externe', this.externe, 'eq')]},
            {or: false, filters:[new Filter('is_closed', 0, 'eq')]},
            {or: false, filters:[new Filter('IsIns2', 1, 'eq')]},
          ];

          super.ngOnInit();
        }
      )
      )

    const detailsView = 'details,copie,affectation,schema,tache,commentaire,fichier';
    this.subscription.add(
      this.route.fragment.subscribe(fragment => {
        this.fragment = fragment;
        if(!detailsView.includes(fragment)) {
          this.fragment = 'details';
        }
      })
      )


    this.subscription.add(
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
      })
      )


    this.onLoadChild();
  }

  onLoadChild() {
    if(this.route.firstChild) {
       return this.route.firstChild.data.subscribe(
       )
    }
    this.uiService.courrierEntrantData = null;
  }

  onShowCreateForm(item?, modal = this.editModal) {
    let _result$ = new Subject<any>();
    const result$ = _result$.asObservable();
    if (modal) {
        const modalRef = this.modalService.open(this.editModal, { size: 'lg', centered: true, backdrop: 'static' });
        modalRef.componentInstance.isUpdating = false;
        modalRef.componentInstance.title = 'Créer';
        modalRef.componentInstance.externe = this.externe;

        // In case it's create from existing element
        if (item) {
          modalRef.componentInstance.title = item.libelle ? `Créer comme: ${item.libelle}` : 'Créer';
          modalRef.componentInstance.item = item;
        }

        modalRef.componentInstance.newItem.subscribe(
          (data: any) => {
            this.dataHelper.addItem(data);
            _result$.next(data);
          }
        );
    }

    return result$;
  }

  onShowUpdateForm(item: any, modal = this.editModal) {
    let _result$ = new Subject<any>();
    const result$ = _result$.asObservable();
    if (modal) {
        const modalRef = this.modalService.open(this.editModal, { size: 'lg', centered: true,  backdrop: 'static' });
        modalRef.componentInstance.title = `Modifier: ${item.libelle}`;
        modalRef.componentInstance.item = item;
        modalRef.componentInstance.externe = this.externe;
        modalRef.componentInstance.isUpdating = true;
        modalRef.componentInstance.newItem.subscribe(
          (data) => {
            this.dataHelper.updateItem(data);
            _result$.next(data);
          }
        );
    }
    return result$;
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

public getTypes(): void {
  if(this.dependancies.types && this.dependancies.types.length) {
    return;
  }
  this.dependanciesLoading.types = true;
  const service = new CrTypeFactory();
  service.list(new QueryOptions().setSort([new Sort('libelle','ASC')])).pipe(
    shareReplay(1),
    map(data => data.data)
  ).subscribe((types: any) => {
    this.dependancies.types = types;
    this.dependanciesLoading.types = false;
  });
}

public getNatures(): void {
  if(this.dependancies.natures && this.dependancies.natures.length) {
    return;
  }
  this.dependanciesLoading.natures = true;
  const service = new CrNatureFactory();
  service.list(new QueryOptions().setSort([new Sort('libelle','ASC')])).pipe(
    shareReplay(1),
    map(data => data.data)
  ).subscribe((natures: any) => {
    this.dependancies.natures = natures;
    this.dependanciesLoading.natures = false;
  });
}

public getUsers(): void {
  if(this.dependancies.users && this.dependancies.users.length) {
    return;
  }
  this.dependanciesLoading.users = true;
  const service = new UserFactory();
  service.list(new QueryOptions().setSort([new Sort('prenom','ASC'), new Sort('nom','ASC')])
).pipe(
  shareReplay(1),
  map(data => data.data)
).subscribe((users: any) => {
    this.dependancies.users = users;
    this.dependanciesLoading.users = false;
  });
}

public getUrgences(): void {
  if(this.dependancies.urgences && this.dependancies.urgences.length) {
    return;
  }
  this.dependanciesLoading.urgences = true;
  const service = new CrUrgenceFactory();
  service.list(new QueryOptions().setSort([new Sort('libelle','ASC')])).pipe(
    shareReplay(1),
    map(data => data.data)
  ).subscribe((urgences: any) => {
    this.dependancies.urgences = urgences;
    this.dependanciesLoading.urgences = false;
  });
}

public getCoordonnees(): void {
  if(this.dependancies.coordonnees && this.dependancies.coordonnees.length) {
    return;
  }
  this.dependanciesLoading.coordonnees = true;
  const service = new CrCoordonneeFactory();
  service.list(new QueryOptions().setSort([new Sort('libelle','ASC')])).pipe(
    shareReplay(1),
    map(data => data.data)
  ).subscribe((coordonnees: any) => {
    this.dependancies.coordonnees = coordonnees;
    this.dependanciesLoading.coordonnees = false;
  });
}

 open(content) {
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', modalDialogClass: 'modal-right modal-right-100vh', }).result.then((result) => {

  }, (reason) => {

  });
}
isEcheanceExpired(date: Date) {
  // your date logic here, recommend moment.js;
  return moment(date).isBefore(moment(new Date()));
  // or without using moment.js:
  // return product.experationDate.getTime() < currentdate.getTime();
  // or using Date
  // return new Date(product.experationDate).valueOf() < new Date(currentdate).valueOf();
}

  getDateStyle(date: Date) {
   let diff = moment(moment(date)).diff(moment(new Date()), 'days');
    if(diff < 7 && diff >=1 ) {
      return 'text-warning'
    }

    if(diff <= 0) {
      return 'text-danger';
    }

    return "tx-success-100"
  }

  onSelectCourrier(courrier: ICrCourrierEntrant = null) {
    this.uiService.courrierEntrantData = courrier;
    this.router.navigate(['./', courrier.id], {relativeTo: this.route});
  }

  onShowClotureCourrierForm(courrier: ICrCourrierEntrant, position = 0) {
    const modalRef = this.modalService.open(ClotureCourrierEditComponent, { size: 'lg', centered: true,  backdrop: 'static' });
    modalRef.componentInstance.item = courrier.courrier;
    modalRef.componentInstance.title = 'Clore ce courrier'
    modalRef.componentInstance.isUpdating = true;
    modalRef.componentInstance.newItem.subscribe(
      (data: ICrCourrier) => {
        courrier.courrier.cloture_id = data.cloture_id;
        courrier.courrier.date_cloture  = data.date_cloture;
        courrier.courrier.message_cloture = data.message_cloture;
        courrier.courrier.cloture = data.cloture;
        if(!this.showClose) {
          const reopen = ()=>{
            this.dataHelper.addItemTo(courrier, position);
            this.onQuickReopen(courrier);
          };
          this.dataHelper.removeItem(courrier.id);
          return this.notificationService.onCancel(reopen, courrier.courrier?.cloture.libelle, courrier.libelle, courrier.courrier.cloture.valider ? 'success' : 'error');
        }
      }
    );
  }

  onQuickReopen(courrier) {
    courrier.courrier.cloture_id = null;
    courrier.courrier.date_cloture  = null;
    courrier.courrier.message_cloture = null;
    courrier.courrier.cloture = null;
    const service = new CrCourrierFactory();
    service.update({
      id: courrier.courrier.id,
      reopenCourrier: 1
    }).subscribe(
      (data: ICrCourrier)=> {}
    )
  }
  onReonpenCourrier(courrier: ICrCourrierEntrant) {

  this.notificationService.title = courrier.libelle;

  this.notificationService.body = 'Êtes-vous sûr(e) de vouloir réouvir le courrier?';

  const confirm = () => {
    courrier.courrier.cloture_id = null;
    courrier.courrier.date_cloture  = null;
    courrier.courrier.message_cloture = null;
    courrier.courrier.cloture = null;
    const service = new CrCourrierFactory();
    service.update({
      id: courrier.courrier.id,
      reopenCourrier: 1
    }).subscribe(
      (data: ICrCourrier)=> {
      }
    )
  };

  const cancel = () => {
  };

  this.notificationService.bodyMaxLength = 300;
  this.notificationService.backdrop =  0;
  this.notificationService.onConfirmation(confirm, cancel);

  this.notificationService.bodyMaxLength = 80;
  this.notificationService.backdrop =  -1;

  }

  onShowAffectationTacheForm() {
    const modalRef = this.modalService.open(AffectationCourrierEditComponent, { size: 'lg', centered: true,  backdrop: 'static' });
    modalRef.componentInstance.title = `Collaborateur`;
    modalRef.componentInstance.item = this.selectedCourrier.courrier;
    modalRef.componentInstance.isUpdating = true;
    modalRef.componentInstance.newItem.subscribe(
      (data: ICrCourrier) => {
        Object.assign(this.selectedCourrier.courrier,data);
      }
    );
  }

  onShowUpdateCourrierForm() {
    const modalRef = this.modalService.open(CourrierEntrantEditFormComponent, { size: 'lg', centered: true,  backdrop: 'static' });
    modalRef.componentInstance.item = this.selectedCourrier;
    modalRef.componentInstance.isUpdating = true;
    modalRef.componentInstance.externe = this.externe;
    modalRef.componentInstance.newItem.subscribe(
      (data) => {
        // this.dataHelper.updateItem(data);
        Object.assign(this.selectedCourrier,data);
      }
    );
  }

  scrollToTop(el, callback = ()=>{}) {
    var to = 0;
    var duration = 1000;
    var start = el.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;

    var easeInOutQuad = function(t, b, c, d) {
        t /= d / 2;
        if (t < 1)
            return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    var animateScroll = function() {
        currentTime += increment;
        var val = easeInOutQuad(currentTime, start, change, duration);

        el.scrollTop = val;
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
            return;
        }
        callback();
    }
    animateScroll();
  }
}
