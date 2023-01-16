import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'inline-editor',
  templateUrl: './inline-editor.component.html',
  styleUrls: ['./inline-editor.component.css']
})
export class InlineEditorComponent implements OnInit, OnChanges {

  @Input('value') _value;
  @Input('type') _type = 'text';
  @Input('name') _name;
  @Input('isLoading') _isLoading = false;
  @Input('selectItems') _selectItems = [];
  @Input('placeholder') _placeholder;
  @Output() public onSave: EventEmitter<any> = new EventEmitter();
  _autoclose: 'outside' | false = 'outside';

  editorForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.editorForm = this.createFormGroup();

    if (!this._value && !this._placeholder) {
      this._placeholder = ' -- aucune valeur --';
    }
  }

  onSubmit() {
    this.onSave.emit(this.editorForm.controls.valeur.value);
    if (this._placeholder == ' -- aucune valeur --') {
      this._placeholder = null;
    }
  }

  createFormGroup() {
    switch (this._type) {
      case 'text':
        return new FormGroup({
          valeur : new FormControl(this._value,  [Validators.required]),
         });
        break;
      case 'email':
         return  new FormGroup({
          valeur : new FormControl(this._value,  [Validators.required, Validators.email]),
         });
         break;
      default:
      return new FormGroup({
        valeur : new FormControl(this._value,  [Validators.required]),
       });
      break;
    }
  }

  isShow() {
    this.editorForm.controls.valeur.setValue(this._value);
  }

  shouldShowRequiredError() {

    const libelle = this.editorForm.controls.valeur;
    return (libelle.dirty || libelle.touched) && libelle.hasError('required');

  }


  shouldDisableSubmit() {
    return this._isLoading || ( this.editorForm.valid && !(this.editorForm.dirty || this.editorForm.touched) ) || this.editorForm.invalid;
  }

  ngOnChanges(): void {
      if (this._isLoading)
      {
        this._autoclose = false;
      } else {
        this._autoclose = 'outside';
      }
  }

}
