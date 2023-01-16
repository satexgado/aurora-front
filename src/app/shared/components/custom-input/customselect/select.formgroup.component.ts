import { Component,  Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

export interface SelectIconItem {value: string; icon_class?: string};

@Component({
  selector: 'app-select-formgroup',
  templateUrl: './select.formgroup.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectFormGroupComponent,
      multi: true
    }
  ],
  styleUrls: ['./select.formgroup.component.css']
})
export class SelectFormGroupComponent implements ControlValueAccessor, OnInit {
  onChange: Function;
  onTouched: Function;
  loading = true;
  @Input() small = false;
  @Input() selected: string | null = null;
  @Input() alreadySelected: any[] = [];
  items: any[] = [];
  @Input() label = 'Selectionnez';
  @Input('createModal') createModal;
  @Input() createCallback: Function;
  @Input() createAdditionalParam: {name: string, value: any}[];
  @Output() selectedItemEmitter = new EventEmitter<any>(); ;
  @Output() itemCreated = new EventEmitter<any>();
  @Input() required = true;
  @Input('dataSource')
  set dataSource$(dataSource: Observable<[]>) {
    this.loading = true;
    dataSource.subscribe(
      (data)=>{
        this.items = data;
        this.loading = false;
      }
    )
  };

  constructor(protected modalSelect: NgbModal) {
  }

  ngOnInit()
  {

  }

  onShowCreateForm() {
    if(this.createModal){
        const modalRef = this.modalSelect.open(this.createModal, { size: 'lg', centered: true, backdrop: 'static' });
        const instance = modalRef.componentInstance;
        instance.title = 'Créer';
        instance.isUpdating = false;

        if(this.createAdditionalParam && this.createAdditionalParam.length) {
          this.createAdditionalParam.forEach(element => {
            instance[element.name]= element.value;
          });
        }

        instance.newItem.subscribe(
          (data: any)=>{
            this.items.push(data);
            this.onSetSelected(data.id);
            this.itemCreated.emit(data);
            if(this.createCallback) {
              this.createCallback();
            }
          }
        )
    }
  }

  onSetSelected(value = null)
  {
    this.selectedItemEmitter.emit(value);
    this.selected = value;
    this.onChange(value);
    this.onTouched(true);
  }

  writeValue( value: string ) {
    // clear selected input
    this.selected = value;
  }

  registerOnChange( fn: Function ) {
    this.onChange = fn;
  }

  registerOnTouched( fn: Function ) {
    this.onTouched = fn;
  }

}

