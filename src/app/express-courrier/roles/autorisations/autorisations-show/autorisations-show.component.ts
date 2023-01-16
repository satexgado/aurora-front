import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-autorisations-show',
  templateUrl: './autorisations-show.component.html',
  styleUrls: ['./autorisations-show.component.scss'],
})
export class AutorisationsShowComponent implements OnInit {
  @Input() name: string;
  @Input() autorisation: string;
  constructor() {}

  ngOnInit(): void {}
}
