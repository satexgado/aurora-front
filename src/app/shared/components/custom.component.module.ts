import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { BaseEditComponent } from './edit/base-edit.component';
import { EditableListComponent } from './editable-list/editable.list.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseEditSimpleComponent } from './edit/base-edit-simple.component';

@NgModule({
    declarations: [
      EditableListComponent,
      BaseEditComponent,
      BaseEditSimpleComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        NgbModalModule
    ],
    exports: [
      EditableListComponent,
      BaseEditSimpleComponent,
      BaseEditComponent
    ],
    entryComponents:[
    ]
})
export class CustomComponentModule {

}
