import { GedModeleFactory, iconSubfolder } from 'src/app/core/services/gestion-document/ged-modele.factory';

import { ChangeDetectorRef, Component, Input } from '@angular/core';
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
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChooseItem2Component } from 'src/app/modules/choose-item/single2/choose-item2.component';
import { CacheService } from 'src/app/shared/services';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-icon-choose-item2',
  templateUrl: './icon-choose-multi-item2.component.html',
  styleUrls: ['./icon-choose-multi-item2.component.css'],
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
export class IconChooseItem2Component extends ChooseItem2Component {

  typeIcon:  iconSubfolder = null;
  onlyType: iconSubfolder[];
  iconSubfolderList = Object.keys(iconSubfolder)
  .map(key => ({ libelle: key, id: iconSubfolder[key] }));
  storageUrl = environment.storageUrl;

  searchTerm = '';
  hideTypeSelector = false;
  iconHelper$: Observable<string[]>;
  selectedItem = null;
  iconList: string[];
  iconListChunk: any[];
  iconListReading: string[];
  iconIsLoading: boolean = false;

  get name() {
    return this.title;
  }

  @Input() set defaultType( defaultType: iconSubfolder | iconSubfolder[] ) {
    
    if(!Array.isArray(defaultType)) {
      defaultType = [defaultType];
    }

    if(defaultType.length == 1) {
      this.onChangeTypeIcon(defaultType[0]);
      this.hideTypeSelector = true;
      return;
    }

    this.onlyType = defaultType;
  }

  hasSelectedItemCode(item: string): boolean
  {
    return item == this.selectedItem;
  }

  onChangeTypeIcon(type : iconSubfolder | null) {
    this.typeIcon = type;
    if(type != null) {
      this.iconIsLoading = true;
      const service = new GedModeleFactory();
      this.cacheService.get(
        type,
        service.icon(type),
      180000).pipe(
        filter(data=>data)
      ).subscribe(
        (data: string[])=> {
          this.iconList = data;
          this.iconListChunk=[];
          if(data && data.length > 60) {
            let chunkSize = 60;
            let chunkLength =  Math.round(this.iconList.length/chunkSize);
            console.log(chunkSize);
            for (let i=0; i<this.iconList.length; i+=chunkSize) {
                if(this.iconListChunk.length<chunkLength-1)
                  this.iconListChunk.push(this.iconList.slice(i,i+chunkSize));
                else{
                  this.iconListChunk.push(this.iconList.slice(i));
                  break;
                }
            };
            this.iconListReading = this.iconListChunk.length ? this.iconListChunk[0]: [];
            this.iconListChunk.shift();
          } else {
            this.iconListReading  = this.iconList;
          } 
          this.iconIsLoading = false;
          console.log(this.iconListChunk);
        }
      )
    }
  }

  checkData() {
    if(this.iconListChunk && this.iconListChunk.length) {
      this.iconListReading = [...this.iconListReading, ...this.iconListChunk[0]];
      this.iconListChunk.shift();
    }
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

    ngOnDestroy() {
    }

    onEmitChoosenItem() {
      this.onChooseItem(this.selectedItem);
    }
}