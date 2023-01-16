import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { EditableListComponent, NotificationService } from 'src/app/shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Event, NavigationCancel, NavigationEnd, NavigationError, Router } from '@angular/router';
import { CoordonneeDetailsService } from '../coordonnee-details.service'
import * as moment from 'moment';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { ICrCourrierSortant } from 'src/app/core/models/gestion-courrier/cr-courrier-sortant';
import { ICrCoordonnee } from 'src/app/core/models/gestion-courrier/cr-coordonnee';
import { CacheService } from 'src/app/shared/services';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { Helper } from 'src/app/helpers/helper/helper';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { CrCourrierSortantFactory } from 'src/app/core/services/gestion-courrier/cr-courrier-sortant';
import { CrTypeFactory } from 'src/app/core/services/gestion-courrier/cr-type';
import { map, shareReplay } from 'rxjs/operators';
import { CrNatureFactory } from 'src/app/core/services/gestion-courrier/cr-nature';
import { UserFactory } from 'src/app/core/services/user.factory';
import { CrUrgenceFactory } from 'src/app/core/services/gestion-courrier/cr-urgence';
import { CrCoordonneeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee';

@Component({
  selector: 'app-cood-courrier-sortant',
  templateUrl: 'cood-csortant.component.html',
  styleUrls: ['./cood-csortant.component.css'],
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

export class CoodCourrierSortantComponent extends EditableListComponent implements OnInit {

  @ViewChild('scrollContainer')
  scrollContainer: ElementRef;

  view: 'card' | 'list' =  localStorage.getItem("courrierViewType") ? <'card' | 'list'>localStorage.getItem("courrierViewType"):  'card';
  fragment: string;
  showClose;
  showOpen = true;
  selectedCourrier: ICrCourrierSortant;
  parentData: {relationName: string,relationId: number} = null;
  expediteur: ICrCoordonnee;
  coordonneeID:number = 0;

  filters = {
    type_id: [],
    structure_id: [],
    suivi_par_id: [],
    nature_id: [],
    urgence_id: [],
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
      type_id: [],
      structure_id: [],
      suivi_par_id: [],
      nature_id: [],
      urgence_id: [],
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
      this.dataHelper.query = [
        {or: false, filters:[new Filter('DestinataireId', this.coordonneeID,  'eq')]},
      ];
    } else if(this.showOpen && !this.showClose) {
      this.dataHelper.query = [
        {or: false, filters:[new Filter('DestinataireId', this.coordonneeID,  'eq'), new Filter('is_closed', 0, 'eq')]},
      ];
    } else if (this.showClose && !this.showOpen) {
      this.dataHelper.query = [
        {or: false, filters:[new Filter('DestinataireId', this.coordonneeID,  'eq'), new Filter('is_closed', 1, 'eq')]},
      ];
    } else {
      this.dataHelper.query = [
        {or: false, filters:[new Filter('DestinataireId', this.coordonneeID,  'eq'), new Filter('id', '', 'eq')]},
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
    public structureService: StructureService,
    protected uiService: CoordonneeDetailsService,
    public route: ActivatedRoute,
    public helper2: Helper,
    protected modalService: NgbModal,
    private router: Router,
  ) {
    super(new ResourceScrollableHelper(new CrCourrierSortantFactory()));
    this.modalService = modalService;
  }

  onChangeView(view : 'card' | 'list') {
    this.view = view;
    localStorage.setItem('courrierViewType',view);
  }

  ngOnInit() {
    this.uiService.courrierSortantData$.subscribe(
      (courrier)=> {
        this.selectedCourrier = courrier;
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
              {or: false, filters: [
                new Filter('DestinataireId', data.coordonnee.id,  'eq'),
                new Filter('is_closed', 0, 'eq')
              ]}
          ],
          [
            'cr_courrier.cr_type',
            'cr_courrier.cr_nature',
            'cr_courrier.cr_urgence',
            'cr_courrier.cr_statut',
            'cr_destinataires.cr_coordonnee',
            'cr_ampiliations.cr_coordonnee',
            'cr_courrier.cr_cloture'
          ],
          8,
          1,
          [new Sort('updated_at','DESC')]
        );
        this.dataHelper = new ResourceScrollableHelper(new CrCourrierSortantFactory(), queryOptions);
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

    this.onLoadChild();
    const detailsView = 'details,destinataire,ampiliation,tache,commentaire,fichier';
    this.route.fragment.subscribe(fragment => {
      this.fragment = fragment;
      if(!detailsView.includes(fragment)) {
        this.fragment = 'details';
      }
    })
  }

  onLoadChild() {
    if(this.route.firstChild) {
       return this.route.firstChild.data.subscribe()
    }
    this.uiService.courrierSortantData = null;
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
  
    onSelectCourrier(courrier: ICrCourrierSortant = null) {
      this.uiService.courrierSortantData = courrier;
      this.router.navigate(['./', courrier.id], {relativeTo: this.route});
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
