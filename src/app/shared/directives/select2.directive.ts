import { Directive, EventEmitter, ElementRef, AfterViewInit, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NgControl } from '@angular/forms';
import { HelperService } from '../services/helper.service';
import { resourceToSelect2 } from '../helperfonction';


declare var $: any;

@Directive({
  selector: '[appSelect2]'
})
export class Select2Directive implements AfterViewInit, OnChanges {
  select2: any;
  original_value: any = [];

  @Input()
  private readonly dataUrl: string;

  @Input() preselected = [];

  @Input() data = [];

  @Input()
  placeholder: string;

  @Output()
  itemSelected = new EventEmitter<boolean>();

  constructor(private el: ElementRef, private control: NgControl, private helper: HelperService) {

  }

  ngAfterViewInit(): void {
    if (this.dataUrl) {
      this.initializeSelect2();
    } else {
      this.initializeSelect2WithoutAjax();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    //const dataUrl = changes.dataUrl;
    const preselected = changes.preselected;
    const data = changes.data;

    // There are instances that at first dataUrl are not available.
    if (preselected && preselected.currentValue) {
      if(this.preselected.length)
      {
        this.ngAfterViewInit();
        this.preselected.forEach((data)=>{
          var $option = $("<option selected></option>").val(data.id).text(data.text);
          this.select2.append($option)
        });
        this.control.control.setValue(this.select2.val());
        this.setOriginalValue();
        this.select2.trigger('change'); // append the option and update Select2  
      } 
    }

    if(data.isFirstChange)
    {
      this.initializeSelect2WithoutAjax();
    }
  }

  setOriginalValue()
  {
    this.original_value = this.control.control.value;
  }

  // TODO: Use select2 transport option instead of ajax
  initializeSelect2(): void {
    const fullUrl = environment.api_url + this.dataUrl;

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
      multiple: true,
      allowClear: true,
      //placeholder: this.placeholder || '',
      placeholder: '',
      ajax: {
        url: fullUrl,
        delay: 250,
        closeOnSelect: false,
        data: function (params) {
            const query = {
                search: params.term,
                /*limit: params.limit || 10,
                page: params.page || 1,*/
            };

            return query;
        },
        processResults: function (data, params) {
          params.page = params.page || 1;
            return {
                results: data.items
                /*,
                pagination: {
                  more: true
                }*/
            };
        }
      },
      minimumInputLength: 1
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
  }

  // TODO: Use select2 transport option instead of ajax
  initializeSelect2WithoutAjax(): void {

    if(this.data && this.data.length)
    {
      this.data = resourceToSelect2(this.data);
    } else {
      this.data = [];
    }
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
      multiple: true,
      allowClear: true,
      //placeholder: this.placeholder || '',
      placeholder: '',
      data: this.data
      // minimumInputLength: 1
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
    this.select2.trigger('change');
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

  clear() {
    if (this.select2) {
      this.select2.val(null).trigger('change');
      this.control.control.setValue(null);
      this.isControlDirty();
    }
  }
}
