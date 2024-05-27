import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IUser } from 'src/app/core/models/user';
import { UserChooseMultiItem2Component } from '../user-choose/user-choose-multi-item2.component';
import { filterGrp } from 'src/app/shared/models/query-options/query-options.model';


@Component({
  selector: 'app-user-select',
  templateUrl: './user-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: UserSelectComponent,
      multi: true
    }
  ],
  styleUrls: ['./user-select.component.css']
})
export class UserSelectComponent implements ControlValueAccessor {
  onChange: (param: any) => void;
  onTouched: (param: any) => void;
  selected: IUser[];
  @Input() label = null;
  @Input() userFilter: filterGrp[] = null;
 
  // get libelle() {
  //   return this.selected ? `${this.selected.libelle} - ${this.selected.objet}` :'';
  // }
  constructor(
    protected modalService: NgbModal
  ) {
  }

  onSetSelected(value = null) {
    this.selected = value;
    if (this.onChange && this.onTouched) {
      this.onChange(value);
      this.onTouched(true);
    }
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

  onChooseUsers()
  {
    const modalRef = this.modalService.open(UserChooseMultiItem2Component,{ size: 'lg', centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as UserChooseMultiItem2Component;
    instance.userFilter = this.userFilter;
    if(this.selected && this.selected.length){
      instance.preselected = this.selected;
    }

    instance.multipleItemChoosen.subscribe(
      (data)=>{
        this.onSetSelected(data);
      }
    )
  }

}

