import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectIconItem {libelle: string; iconClass?: string; id?: any; }

@Component({
  selector: 'app-custom-select-icon',
  templateUrl: './custom-select-icon.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomSelectIconComponent,
      multi: true
    }
  ],
  styleUrls: ['./custom-select-icon.component.css']
})
export class CustomSelectIconComponent implements ControlValueAccessor {
  private _items: SelectIconItem[] = [];
  onChange: (param: any) => void;
  onTouched: (param: any) => void;
  @Output() itemSelectedEmitter = new EventEmitter<any>();
  @Input() selected: string | null = null;

  @Input() set items(items: SelectIconItem[]) {
    if (items && items.length) {
      this._items = items.map((element) => {
        if (element.id ===  undefined) {
          element.id = element.libelle;
        }
        return element;
      });
    }
  }

  get items() {
    return this._items;
  }
  constructor() {
  }

  onSetSelected(value = null) {
    this.selected = value;
    if (this.onChange && this.onTouched) {
      this.onChange(value);
      this.onTouched(true);
    }
    this.itemSelectedEmitter.emit(value);
  }

  writeValue( value: any ) {
    // clear selected input
    this.selected = value;
  }

  registerOnChange( fn: (param: any) => void ) {
    this.onChange = fn;
  }

  registerOnTouched( fn: (param: any) => void ) {
    this.onTouched = fn;
  }

}

