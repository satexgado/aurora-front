import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersImageGroupedComponent } from './users-image-grouped/users-image-grouped.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterButtonComponent } from './filter-button/filter-button.component';
import { RouterModule } from '@angular/router';
import { SearchFieldComponent } from './search-field/search-field.component';

@NgModule({
  declarations: [
    UsersImageGroupedComponent,
    FilterButtonComponent,
    SearchFieldComponent,
  ],
  imports: [CommonModule, NgbTooltipModule, RouterModule],
  exports: [
    UsersImageGroupedComponent,
    FilterButtonComponent,
    SearchFieldComponent,
  ],
})
export class UiElementsModule {}
