import { BehaviorSubject } from "rxjs";

export class ItemSelectHelper{
    protected _selectedItem$: BehaviorSubject<any> = new BehaviorSubject(null);
    protected _selectedItems = new Set();
    get selectedItemsNumber() {
        return this._selectedItems.size
    }

    get selectedItem()
    {
        return <[]> Array.from(this._selectedItems);
    }

    get selectedItem$() {
        return this._selectedItem$.asObservable();
    }

    sendData() {
        this._selectedItem$.next(
           this.selectedItem 
        )
    }

    hasSelectedItem(item: any): boolean
    {
        return this._selectedItems.has(item);
    }

    isAllItemSelected(dataSize) {
        return dataSize <= this._selectedItems.size;
    }

    addSelectedItem(index: any[] | any) {
        this.doAddSelectedItem(index);
        this.sendData();
    }

    private doAddSelectedItem(index: any[] | any) {
        if(index instanceof Array){
            if(index.length) {
              return index.forEach((element) =>{
                this._selectedItems.add(element);
              })
            }
            return;
        }
        return this._selectedItems.add(index);
    }

    removeSelectedItem(index: any) {
        this._selectedItems.delete(index);
        this.sendData();
    }

    toggleSelectedItem(index: any) {
        if(this.hasSelectedItem(index))
        {
          this._selectedItems.delete(index);
        } else {
          this._selectedItems.add(index);
        }
        this.sendData();
    }

    clearSelection()
    {
        this._selectedItems.clear();
    }
}
