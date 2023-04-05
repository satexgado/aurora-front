import { CourrierChooseItem2Component } from './../choose/courrier-choose-item2.component';
import { ICrCourrier } from 'src/app/core/models/gestion-courrier/cr-courrier';
import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-courrier-select',
  templateUrl: './courrier-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CourrierSelectComponent,
      multi: true
    }
  ],
  styleUrls: ['./courrier-select.component.css']
})
export class CourrierSelectComponent implements ControlValueAccessor {
  onChange: (param: any) => void;
  onTouched: (param: any) => void;
  selected: ICrCourrier;
  @Input() label = null;
  @Input() defaultType: 'entrant' | 'sortant' | 'interne' | ('entrant' | 'sortant' | 'interne') [];

  get libelle() {
    return this.selected ? `${this.selected.libelle} - ${this.selected.objet}` :'';
  }
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

  onChooseCourrier()
  {
    const modalRef = this.modalService.open(CourrierChooseItem2Component,{ size: 'lg', centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as CourrierChooseItem2Component;
    
    if(this.defaultType) {
      instance.defaultType = this.defaultType;
    }

    instance.itemChoosen.subscribe(
      (data)=>{
        this.onSetSelected(data);
      }
    )
  }

}

