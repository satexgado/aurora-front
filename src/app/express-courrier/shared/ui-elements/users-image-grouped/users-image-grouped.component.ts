import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-users-image-grouped',
  templateUrl: './users-image-grouped.component.html',
  styleUrls: ['./users-image-grouped.component.scss'],
})
export class UsersImageGroupedComponent implements OnInit {
  @Input() users: any[] = [];
  @Input() displayCount: number = 5;
  @Input() maxSize: boolean = false;
  @Input() tooltipPlacement: string = 'top';
  constructor() {}

  ngOnInit(): void {}
}
