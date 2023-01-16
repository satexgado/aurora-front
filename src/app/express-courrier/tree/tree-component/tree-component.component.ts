import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tree-component',
  templateUrl: './tree-component.component.html',
  styleUrls: ['./tree-component.component.scss'],
})
export class TreeComponentComponent implements OnInit {
  @Input() elements: any[] = [];
  constructor() {}

  ngOnInit(): void {}
}
