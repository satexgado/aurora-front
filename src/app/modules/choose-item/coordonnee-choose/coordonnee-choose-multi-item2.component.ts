
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/shared';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { ChooseMultiItem2Component } from 'src/app/modules/choose-item/multi2/choose-multi-item2.component';
import { CacheService } from 'src/app/shared/services';
import { ExpressCourrierService } from 'src/app/express-courrier/express-courrier.service';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { ICrCoordonnee } from 'src/app/core/models/gestion-courrier/cr-coordonnee';
import { CrCoordonneeFactory } from 'src/app/core/services/gestion-courrier/cr-coordonnee';

@Component({
  selector: 'app-coordonnee-choose-multi-item2',
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
export class CoordonneeChooseMultiItem2Component extends ChooseMultiItem2Component {

  view: 'card' | 'list' =  localStorage.getItem("userViewType") ? <'card' | 'list'>localStorage.getItem("userViewType"):  'card';
  onChangeView(view : 'card' | 'list') {
    this.view = view;
    localStorage.setItem('userViewType',view);
  }

  hasSelectedCoordonnee(item: ICrCoordonnee): boolean
  {
    let selectedItemCode = Array.from(this._selectedItems).map(
      (opt: ICrCoordonnee)=> opt.id
    );
    return selectedItemCode.includes(item.id);
  }

  CoordonneeHelper: ResourceScrollableHelper = new ResourceScrollableHelper(new CrCoordonneeFactory());

  constructor(
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    protected cacheService: CacheService,
    public cdRef: ChangeDetectorRef,
    public expressService: ExpressCourrierService,
    public notificationService: NotificationService) {
    super(
      activeModal,  cdRef,  modalService
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
      this.multipleItemChoosen.emit(this.selectedItem);
    }
}
