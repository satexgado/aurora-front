import { NgModule } from '@angular/core';

import { StructureComponent } from './structure.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { StructureRoutingModule } from './structure-routing.component'
import { EmployeModule } from 'src/app/express-courrier/administration/utilisateur/employe/employe.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        StructureRoutingModule,
        EmployeModule
    ],
    exports: [],
    declarations: [StructureComponent],
    providers: [],
})
export class StructureModule { }
