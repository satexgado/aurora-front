import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-users-image-grouped',
  templateUrl: './users-image-grouped.component.html',
  styleUrls: ['./users-image-grouped.component.scss'],
})
export class UsersImageGroupedComponent implements OnInit {
  users: any[] = [];
  @Input() displayCount: number = 5;
  @Input() maxSize: boolean = false;
  @Input() tooltipPlacement: string = 'top';

  @Input('users') set usersList(users: any[]) {
    if(!users) {
       this.users = [];
       return;
    }
    let _selectedItems = new Set();
    if(users instanceof Array ) {
      users.forEach((element) =>{
        _selectedItems.add(element);
      });
    } else {
      _selectedItems.add(users)
    }
    this.users = Array.from(users.reduce((m, t) => m.set(t.id, t), new Map()).values());
  }
  constructor() {}

  ngOnInit(): void {}

  trackByFn(index, item) {
    return item.id; // or index
  }
}
