import { CrCourrierSortantFactory } from 'src/app/core/services/gestion-courrier/cr-courrier-sortant';
import { Filter } from 'src/app/shared/models/query-options/filter.model';
import { QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { CrCourrierEntrantFactory } from 'src/app/core/services/gestion-courrier/cr-courrier-entrant';
import { ResourceScrollableHelper } from 'src/app/shared/state/resource.scrollable.helper';
import { ChooseItem2Component } from 'src/app/modules/choose-item/single2/choose-item2.component';

import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/shared';
import { Helper } from 'src/app/helpers/helper/helper';
import * as moment from 'moment';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'appècourrier-choose-item2',
  templateUrl: './courrier-choose-item2.component.html',
  styleUrls: ['./courrier-choose-item2.component.css'],
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
export class CourrierChooseItem2Component extends ChooseItem2Component {

  view: 'card' | 'list' =  localStorage.getItem("courrierViewType") ? <'card' | 'list'>localStorage.getItem("courrierViewType"):  'card';
  typeCourrier: 'entrant' | 'sortant' | 'interne' | null = null;

  courrierEntrantHelper: ResourceScrollableHelper = new ResourceScrollableHelper(
    new CrCourrierEntrantFactory(),
    new QueryOptions(
      [
        {or: false, filters:[new Filter('IsIns2', 1, 'eq')]},
        {or: false, filters:[new Filter('externe', 1, 'eq')]},
      ],
      [],
      3,
      1,
      [new Sort('created_at','DESC')]
    )
  );

  courrierSortantHelper: ResourceScrollableHelper = new ResourceScrollableHelper(
    new CrCourrierSortantFactory(),
    new QueryOptions(
      [
        {or: false, filters:[new Filter('IsIns2', 1, 'eq')]},
      ],
      [],
      3,
      1,
      [new Sort('created_at','DESC')]
    )
  );

  courrierInterneHelper: ResourceScrollableHelper = new ResourceScrollableHelper(
    new CrCourrierEntrantFactory(),
    new QueryOptions(
      [
        {or: false, filters:[new Filter('IsIns2', 1, 'eq')]},
        {or: false, filters:[new Filter('externe', 0, 'eq')]},
      ],
      [],
      3,
      1,
      [new Sort('created_at','DESC')]
    )
  );

  onChangeView(view : 'card' | 'list') {
    this.view = view;
    localStorage.setItem('courrierViewType',view);
  }

  onChangeTypeCourrier(type : 'entrant' | 'sortant' | 'interne' |null) {
    this.typeCourrier = type;

    if(type == 'entrant') {
      this.courrierEntrantHelper.loadData();
    }

    if(type == 'sortant') {
      this.courrierSortantHelper.loadData();
    }

    if(type == 'interne') {
      this.courrierInterneHelper.loadData();
    }
  }

  checkDataEntrant() {
    if(this.courrierEntrantHelper.hasMoreData) {
      this.courrierEntrantHelper.loadData();
    }
  }

  checkDataSortant() {
    if(this.courrierSortantHelper.hasMoreData) {
      this.courrierSortantHelper.loadData();
    }
  }

  checkDataInterne() {
    if(this.courrierInterneHelper.hasMoreData) {
      this.courrierInterneHelper.loadData();
    }
  }

  constructor(
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private helper: Helper,
    public notificationService: NotificationService) {
    super(
      activeModal,  modalService,  notificationService
    )
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

}
