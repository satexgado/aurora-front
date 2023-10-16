import { GedModeleFactory, iconSubfolder } from 'src/app/core/services/gestion-document/ged-modele.factory';

import { ChangeDetectorRef, Component, Input } from '@angular/core';
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
import { IUser } from 'src/app/core/models/user';
import { ExpressCourrierService } from 'src/app/express-courrier/express-courrier.service';
import { UserFactory } from 'src/app/core/services/user.factory';
import { ResourceScrollableHelper } from 'src/app/shared/state';

@Component({
  selector: 'app-user-choose-item2',
  templateUrl: './user-choose-multi-item2.component.html',
  styleUrls: ['./user-choose-multi-item2.component.css'],
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
export class UserChooseItem2Component extends ChooseItem2Component {
  view: 'card' | 'list' =  localStorage.getItem("userViewType") ? <'card' | 'list'>localStorage.getItem("userViewType"):  'card';
  onChangeView(view : 'card' | 'list') {
    this.view = view;
    localStorage.setItem('userViewType',view);
  }
  UserHelper: ResourceScrollableHelper = new ResourceScrollableHelper(new UserFactory());
  selectedItem = null;

  get name() {
    return this.title;
  }

  hasSelectedUser(item: IUser): boolean
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
    this.UserHelper.sortColumn = 'nom_complet';
    this.UserHelper.relations = [
      'affectation_structures.structure', 'affectation_structures.fonctions', 'affectation_structures.poste', 'affectation_structures.role'
    ];
    this.UserHelper.loadData(1);
    this.expressService.onlineUsers$.subscribe(
      (data)=> {
        data.forEach(
          (user)=> {
            let item = this.UserHelper.findItemByColumn(user.id) as IUser;
            if(item) {
              item.last_activity_at = user.last_activity_at;
              this.UserHelper.updateItem(item);
            }
          }
        )
        
      }
    );
  }

    ngOnDestroy() {
    }

    onEmitChoosenItem() {
      this.onChooseItem(this.selectedItem);
    }
}
