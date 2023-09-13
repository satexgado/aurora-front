import { IconChooseItem2Component } from './../icon-choose-multi/icon-choose-item.component';
import { ICrCourrier } from 'src/app/core/models/gestion-courrier/cr-courrier';
import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { iconSubfolder } from 'src/app/core/services/gestion-document/ged-modele.factory';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-icon-select',
  templateUrl: './icon-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ItemSelectComponent,
      multi: true
    }
  ],
  styleUrls: ['./icon-select.component.css'],
  styles: [`
  .users-icon {
  position: relative;
  width: 150px;
  height: 140px;

  img {
    width: 150px;
    height: 140px;
    border-radius: 50%;
    border: 5px solid #1f618d !important;
    object-fit: cover;
  }

  .icone i {
    font-size: 75px;
  }

  .cam-icon {
    position: absolute;
    bottom: 0;
    right: 20px;
    font-size: 20px;
  }

  .text {
    position: absolute;
    bottom: 2px;
    font-size: 10px;
    width: 70%;
    padding-top: 4px;
    padding-bottom: 4px;
    text-align: center;
    display: none;
  }

  &:hover {
    > .text {
      display: inline-block;
    }

    > .cam-icon {
      display: none;
    }
  }
}

  `]
})
export class ItemSelectComponent implements ControlValueAccessor {
  onChange: (param: any) => void;
  onTouched: (param: any) => void;
  selected: string;
  @Input() label = null;
  @Input() defaultType: iconSubfolder | iconSubfolder [] = null;
  @Input('placeholder') placeholder = 'assets/img/placeholder-image.png'
  storageUrl = environment.storageUrl;


  get libelle() {
    return this.selected ? `${this.selected}` :'';
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

  onChooseIcon()
  {
    const modalRef = this.modalService.open(IconChooseItem2Component,{ size: 'lg', centered: true,  backdrop: 'static' });
    const instance = modalRef.componentInstance as IconChooseItem2Component;
    
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

