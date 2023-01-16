import { IBase } from 'src/app/core/models/base.interface';
import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { checkBoxRow } from 'src/app/shared/models/query-options';

@Component({
  selector: 'app-select-item-dropdown',
  templateUrl: './select-item-dropdown.component.html',
  styleUrls: ['./select-item-dropdown.component.css']
})
export class SelectItemDropdownComponent implements OnInit, OnDestroy {

  @Input('items$') _items$: Observable<IBase[]>;
  @Input('style') style = 'btn-light'
  subscription = new Subscription();
  @Output('selected') selectedEmetter = new EventEmitter<String>();
  @Input('placeholder') _placeholder: string = '';
  @Input('icon') _icon: string = null;

  _itemsRow : checkBoxRow<string|number>[] = [];
  selected: string;
  is_loading = true;
  constructor() { }

  ngOnInit() {
    if(this._items$)
    {
      let sub = this._items$.subscribe(
        (data)=>{
          data.forEach(element => {
            this._itemsRow.push({
              checked: false,
              libelle: element.libelle,
              value: element.id
          })
        });
        this.is_loading = false;
      });
      this.subscription.add(sub);
  }
}

  onSaveSelected()
  {
    let id = '';
    let libelle = '';
    let i = 0;

    Object.values(this._itemsRow).forEach(function (item) {
      if(item.checked)
      {
        i++;
        id += item.value+',';
        if(i === 1) {
          libelle += item.libelle;
        }
      }
    });

    if(i)
    {
      id = id.substring(0, id.length - 1);
      if(i>1) {
        libelle = `${libelle} +${i-1}`;
      }
      this.selectedEmetter.emit(id);
      this.selected = libelle;
    }else {
      this.selectedEmetter.emit(null);
      this.selected = null;

    }
  }

  clearData()
  {
    this.selected = null;
    this._itemsRow.forEach(element => {
      element.checked = false;
    })
  }

  ngOnDestroy()
  {
    this.subscription.unsubscribe();
  }
}
