import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Event, NavigationCancel, NavigationEnd, NavigationError, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { StructureUiService } from './structure-ui.service';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { UserFactory } from 'src/app/core/services/user.factory';
import { IUser } from 'src/app/core/models/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ExpressCourrierService } from 'src/app/express-courrier/express-courrier.service';

@Component({
    selector: 'app-structure',
    templateUrl: 'structure.component.html',
    styleUrls: ['./structure.component.css'],
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

export class StructureComponent implements OnInit, OnDestroy {
    loading = true;
    structure_data$;
    selectedStructure: any;
    userHelper: ResourceScrollableHelper;
    subscription: Subscription = new Subscription();
    fragment: string;
    modalData: IUser;
    view: 'card' | 'list' =  localStorage.getItem("userViewType") ? <'card' | 'list'>localStorage.getItem("userViewType"):  'card';
    onChangeView(view : 'card' | 'list') {
        this.view = view;
        localStorage.setItem('userViewType',view);
    }

    onSetSelected(structure: any) {
      if(!structure) {
        this.selectedStructure = null;
        this.userHelper = null;
        return;
      }
      const queryOptions = new QueryOptions(
        [
            {or: false, filters: [new Filter('structure_id', structure.id+'' , 'eq')]}
        ],
        [
          'affectation_structures.structure', 'affectation_structures.fonctions', 'affectation_structures.poste', 'affectation_structures.role'
        ]
      );
      this.userHelper = new ResourceScrollableHelper(new UserFactory(), queryOptions);
      this.userHelper.loadData(1);
      this.selectedStructure = structure;
    }

    constructor(
        public structureService: StructureService,
        protected uiService: StructureUiService,
        public route: ActivatedRoute,
        public expressService: ExpressCourrierService,
        private router: Router,
        protected modalService: NgbModal
    ) { }

    ngOnInit() {
        this.structure_data$ = this.structureService.get();
        this.loading = true;

        this.subscription.add(
            this.uiService.structure$.subscribe(
                (structure)=> {
                    this.onSetSelected(structure);
                }
            )
        );

        const detailsView = 'details,service,equipe';
        this.subscription.add(
          this.route.fragment.subscribe(fragment => {
            this.fragment = fragment;
            if(!(this.fragment && detailsView.includes(fragment)) ) {
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
        );

        this.subscription.add(
          this.expressService.onlineUsers$.subscribe(
            (data)=> {
              data.forEach(
                (user)=> {
                  if(!this.userHelper) return;
                  let item = this.userHelper.findItemByColumn(user.id) as IUser;
                  if(item) {
                    item.last_activity_at = user.last_activity_at;
                    this.userHelper.updateItem(item);
                  }
                }
              )
              
          })
        );
    }

    onLoadChild() {
      if(this.route.firstChild) {
          return this.route.firstChild.data.subscribe(
          )
      }
      this.uiService.structure = null;
    }

    onSelectStructure(structure: any = null) {
      this.uiService.structure = structure;
      this.router.navigate(['./', structure.id], {relativeTo: this.route, fragment:'details'});
    }

    openModal(content, data: IUser) {
      this.modalData = data;
      this.modalService.open(content, { size: 'lg', centered: true,  backdrop: 'static' });
    }

    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }
}