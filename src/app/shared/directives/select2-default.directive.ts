import { Directive, EventEmitter, ElementRef, AfterViewInit, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NgControl } from '@angular/forms';
import { HelperService } from '../services/helper.service';
import { resourceToSelect2 } from '../helperfonction';
import { Observable } from 'rxjs';


declare var $: any;

@Directive({
  selector: '[appSelect2Default]'
})
export class Select2DefaultDirective implements OnInit {
  select2: any;
  original_value: any = [];
  @Input() multiple;

  @Input() data: Observable<any> ;

  @Input()
  placeholder: string;

  @Output()
  itemSelected = new EventEmitter<boolean>();

  constructor(private el: ElementRef, private control: NgControl, private helper: HelperService) {

  }

  ngOnInit()
  {
    this.data.subscribe((data)=>{
      $(this.el.nativeElement).empty();
      this.initializeSelect2(data);
      if(this.select2 && data) {
        this.select2.val(null).trigger('change');
        this.control.control.setValue(null);
        let val = [];
        for(let element of data) {
          if(element.selected) {
            val.push(element.id);
            if (!this.select2.find("option[value='" + element.id + "']").length) {
                // Create a DOM Option and pre-select by default
                var newOption = new Option(element.text, element.id, true, true);
                // Append it to the select
                this.select2.append(newOption).trigger('change');
            }
          }
          this.select2.val(val).trigger('change');
          this.control.control.setValue(this.select2.val());
          this.control.control.markAsPristine();
          this.setOriginalValue();
          // this.select2.trigger('change'); // append the option and update Select2
        }
      }
    })
  }

  // TODO: Use select2 transport option instead of ajax
  initializeSelect2(data): void {

    this.select2 = $(this.el.nativeElement).select2({
      language: {
       errorLoading:function(){return"Les résultats ne peuvent pas être chargés."},
       inputTooLong:function(e){var t=e.input.length-e.maximum;return"Supprimez "+t+" caractère"+(t>1?"s":"")},
       inputTooShort:function(e){var t=e.minimum-e.input.length;return"Saisissez au moins "+t+" caractère"+(t>1?"s":"")},
       loadingMore:function(){return"Chargement de résultats supplémentaires…"},
       maximumSelected:function(e){return"Vous pouvez seulement sélectionner "+e.maximum+" élément"+(e.maximum>1?"s":"")},
       noResults:function(){return"Aucun résultat trouvé"},
       searching:function(){return"Recherche en cours…"}
      },
      multiple: !!this.multiple,
      allowClear: true,
      data: data,
      closeOnSelect: false,
      scrollAfterSelect: true,
      //placeholder: this.placeholder || '',
      placeholder: '',
    });
    this.select2.on('select2:select', (event) => {
      this.control.control.setValue(this.select2.val());
      this.isControlDirty();
    });

    this.select2.on('select2:unselect', (event) => {
      this.control.control.setValue(this.select2.val());
      this.isControlDirty();
    });

    this.select2.on('select2:open', (event) => {
      this.control.control.markAsTouched();
    });

    this.control.control.setValue(this.select2.val());
  }


  isControlDirty() {
   if(this.helper.isEqual(this.control.control.value, this.original_value))
   {
     this.control.control.markAsPristine();
   }
   else{
    this.control.control.markAsDirty();
   }
  }

  setOriginalValue()
  {
    this.original_value = this.control.control.value;
  }


  clear() {
    if (this.select2) {
      this.select2.val(null).trigger('change');
      this.control.control.setValue(null);
      this.isControlDirty();
    }
  }
}
