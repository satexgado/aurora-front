import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-autorisations-create',
  templateUrl: './autorisations-create.component.html',
  styleUrls: ['./autorisations-create.component.scss'],
})
export class AutorisationsCreateComponent implements OnInit {
  @Input() name: string;
  @Output() valueChanged = new EventEmitter<string>();
  @Input() value = 'NEANT';
  constructor() {}

  ngOnInit(): void {
    console.log(this.value);
  }

  changeValue(value: string) {
    this.valueChanged.emit(value);
  }
}
