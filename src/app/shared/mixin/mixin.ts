import { Output, EventEmitter } from '@angular/core';

export function pageableListMixin(BaseClass) {
    return class extends BaseClass {
      page = 0;
      itemsPerPage = 2;
      get pages() {
        return new Array(this.items.length / this.itemsPerPage);
      }
   
      changePage(page: number) {
        this.page = page;
      }
      get start() {
       return this.page * this.itemsPerPage;
      }
      get end() {
       return this.page * this.itemsPerPage + this.itemsPerPage;
      }
  }
}
export function selectableListMixin(BaseClass) {
    class SelectableListMixin extends BaseClass {
      @Output() selected = new EventEmitter<any>();
      @Output() unselected = new EventEmitter<any>();
    
      selectedItems: any[] = [];
      select(item: any) {
        this.selected.emit(item);
        this.selectedItems = [...this.selectedItems, item];
      }
   
      unselect(item: any) {
        this.unselected.emit(item);
        this.selectedItems = this.selectedItems.filter(({value}) => {
          return value !== item.value;
        });
      }
    
      isItemSelected(item: any) {
        return this.selectedItems.some(({value}) => {
          return item.value === value;
        });
      }
    }
    return SelectableListMixin;
}