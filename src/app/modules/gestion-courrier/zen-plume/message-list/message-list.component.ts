import { Component, EventEmitter, OnInit } from '@angular/core';
import { shareReplay, map } from 'rxjs/operators';
import { CacheService } from 'src/app/shared/services';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { Filter, QueryOptions, Sort } from 'src/app/shared/models/query-options';
import { ViewChildren } from '@angular/core';
import { SelectItemDropdownComponent } from 'src/app/dropdown-select/select/select-item-dropdown.component';
import { QueryList } from '@angular/core';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { ICrCommentaire } from 'src/app/core/models/gestion-courrier/cr-commentaire';
import { filterGrp } from 'src/app/shared/models/query-options/query-options.model';
import { CrCommentaireFactory } from 'src/app/core/services/gestion-courrier/cr-commentaire';

@Component({
  selector: 'app-zen-message-list',
  templateUrl: 'message-list.component.html'
})

export class ZenMessageListComponent implements OnInit {
  @ViewChildren(SelectItemDropdownComponent)  selectChildren: QueryList<SelectItemDropdownComponent>;

  @Output() onSelectMessage = new EventEmitter<ICrCommentaire>();
  selectedMessage: ICrCommentaire;

  @Input('filter') set initHelper(queryFilter: filterGrp[]) {
    if(!queryFilter) {
      this.messageHelper = null;
      return ;
    }
    this.queryFilter = queryFilter;
    this.initMessageHelper();
  }

  queryFilter: filterGrp[];

  filter = {
    hasFile: {
      value: false,
      style: 'btn-outline-yeto2 border-0'
    },
    hasNotRead: {
      value: false,
      style: 'btn-outline-yeto2 border-0'
    }
  };

  is_advance_filter;
  messageHelper: ResourceScrollableHelper;

  constructor(
    protected cacheService: CacheService,
  ) { }

  ngOnInit() {
    // this.initMessageHelper();
  }

   initMessageHelper() {
    this.messageHelper = new ResourceScrollableHelper(
      new CrCommentaireFactory(),
      new QueryOptions(
        this.queryFilter,
        ['zen_niveau_message', 'fichiers', 'participants'],
        8,
        1,
        [new Sort('updated_at','DESC')]
      )
    );
    if(this.is_advance_filter) {
      this.messageHelper.searchCustomFilterGroup =
        {or: false, filters:[
          new Filter('has_file', this.filter.hasFile.value, 'eq'),
          new Filter('has_not_read', this.filter.hasNotRead.value, 'eq'),
        ]}
      ;
    }
    this.messageHelper.loadData(1);
  }

  onFilter()
  {
    Object.values(this.filter).forEach(element=>{
      element.style = 'btn-yeto2 border-0';
    });
    this.is_advance_filter = true;
    this.initMessageHelper();
  }

  onChangeFilter(column: string, value: any)
  {
    if(this.filter[column])
    {
      this.filter[column].value = value;
      this.filter[column].style = 'btn-outline-yeto2 border-0';
    }
  }

  getFilterStyle(column)
  {
    return this.filter[column] ? this.filter[column].style : 'btn-outline-yeto2 border-0';
  }

  onRemoveFilter()
  {
    this.selectChildren.forEach((element) => {
      element.clearData();
    });
    Object.values(this.filter).forEach(element=>{
      element.style = 'btn-outline-yeto2 border-0';
      element.value = null;
    });
    this.is_advance_filter = false;
    this.initMessageHelper();
  }

  onSetSelected(message: ICrCommentaire) {
    if(this.selectedMessage && this.selectedMessage.id == message.id) {
      this.selectedMessage = null;
      this.onSelectMessage.emit(null);

      return;
    }
    this.selectedMessage = message;
    this.onSelectMessage.emit(message);
  }


}
