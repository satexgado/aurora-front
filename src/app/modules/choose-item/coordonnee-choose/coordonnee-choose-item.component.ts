import { ChangeDetectorRef, Component} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/shared';
import { Helper } from 'src/app/helpers/helper/helper';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { ChooseItem2Component } from 'src/app/modules/choose-item/single2/choose-item2.component';
import { CacheService } from 'src/app/shared/services';
import { ExpressCourrierService } from 'src/app/express-courrier/express-courrier.service';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { ICrCoordonnee } from 'src/app/core/models/gestion-courrier/cr-coordonnee';
import { CrCoordonneeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee';

@Component({
  selector: 'app-coordonnee-choose-item2',
  templateUrl: './coordonnee-choose-multi-item2.component.html',
  styleUrls: ['./coordonnee-choose-multi-item2.component.css'],
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
export class CoordonneeChooseItem2Component extends ChooseItem2Component {
  view: 'card' | 'list' =  localStorage.getItem("coordonneeViewType") ? <'card' | 'list'>localStorage.getItem("coordonneeViewType"):  'card';
  onChangeView(view : 'card' | 'list') {
    this.view = view;
    localStorage.setItem('coordonneeViewType',view);
  }
  CoordonneeHelper: ResourceScrollableHelper = new ResourceScrollableHelper(new CrCoordonneeFactory());
  selectedItem = null;

  get name() {
    return this.title;
  }

  hasSelectedCoordonnee(item: ICrCoordonnee): boolean
  {
    return item.id == this.selectedItem?.id;
  }

  toggleSelectedItem(item) {
    this.selectedItem = item;
  }


  constructor(
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private helper: Helper,
    public cdRef: ChangeDetectorRef,
    protected cacheService: CacheService,
    public expressService: ExpressCourrierService,
    public notificationService: NotificationService) {
    super(
      activeModal,  modalService,  notificationService
    )
  }

  ngOnInit() {
    super.ngOnInit();
    this.CoordonneeHelper.sortColumn = 'libelle';
    this.CoordonneeHelper.sortDirection = 'Asc';
    this.CoordonneeHelper.relations = ['cr_coordonnee_groupes'];
    this.CoordonneeHelper.loadData(1);
  }

    ngOnDestroy() {
    }

    onEmitChoosenItem() {
      this.onChooseItem(this.selectedItem);
    }
}
