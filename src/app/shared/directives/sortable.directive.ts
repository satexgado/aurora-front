import {Directive, EventEmitter, Input, Output} from '@angular/core';

export type SortDirection = 'Asc' | 'Desc' | '';
const rotate: {[key: string]: SortDirection} = { 'Asc': 'Desc', 'Desc': '', '': 'Asc' };

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "Asc"',
    '[class.desc]': 'direction === "Desc"',
    '[class.sort]': 'direction === ""',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {

  @Input() sortable: string;
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}