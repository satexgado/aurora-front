
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
import { IUser } from 'src/app/core/models/user';
import { UserFactory } from 'src/app/core/services/user.factory';
import { ExpressCourrierService } from 'src/app/express-courrier/express-courrier.service';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { filterGrp } from 'src/app/shared/models/query-options/query-options.model';

@Component({
  selector: 'app-user-choose-multi-item2',
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
export class UserChooseMultiItem2Component extends ChooseMultiItem2Component {

  view: 'card' | 'list' =  localStorage.getItem("userViewType") ? <'card' | 'list'>localStorage.getItem("userViewType"):  'card';
  onChangeView(view : 'card' | 'list') {
    this.view = view;
    localStorage.setItem('userViewType',view);
  }

  hasSelectedUser(item: IUser): boolean
  {
    let selectedItemCode = Array.from(this._selectedItems).map(
      (opt: IUser)=> opt.id
    );
    return selectedItemCode.includes(item.id);
  }

  UserHelper: ResourceScrollableHelper = new ResourceScrollableHelper(new UserFactory());
  @Input() userFilter: filterGrp[];
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
    this.UserHelper.sortColumn = 'nom_complet';
    this.UserHelper.relations = [
      'affectation_structures.structure', 'affectation_structures.fonctions', 'affectation_structures.poste', 'affectation_structures.role'
    ];
    if(this.userFilter){
      this.UserHelper.query = this.userFilter;
    }
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
      this.multipleItemChoosen.emit(this.selectedItem);
    }
}
