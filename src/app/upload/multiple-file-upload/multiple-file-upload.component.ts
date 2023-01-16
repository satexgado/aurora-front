import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-multiple-file-upload',
  templateUrl: './multiple-file-upload.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MultipleFileUploadComponent,
      multi: true
    }
  ],
  styleUrls: ['./multiple-file-upload.component.css']
})
export class MultipleFileUploadComponent implements ControlValueAccessor {
  @Input() progress;
  onChange: Function;
  onTouched: Function;
  files: File[] | null = null;

  @HostListener('change', ['$event.target.files']) emitFiles( event: FileList ) {
    const file = event && event.item;
    this.onChange(file);
    this.onTouched(true);
    if(event.item.length) {
      for(let i = 0; i < event.item.length; i++) {
       this.files.push(event.item(i))
      }
    }
  }

  constructor( private host: ElementRef<HTMLInputElement> ) {
  }

  writeValue( value: null | string[] ) {
    this.host.nativeElement.value = '';
    this.files = null;
    if(value) {
      this.files = [];
      value.forEach(
        (file)=> {
          const blob = new Blob([file]);
          const filename = file.split('/').pop().split('#')[0].split('?')[0];
          this.files.push(new File([blob],filename));
        }
      )

    }
  }

  registerOnChange( fn: Function ) {
    this.onChange = fn;
  }

  registerOnTouched( fn: Function ) {
    this.onTouched = fn;
  }

}

