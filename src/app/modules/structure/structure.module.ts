import { NgModule } from '@angular/core';

import { StructureComponent } from './structure.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { StructureRoutingModule } from './structure-routing.component'
import { EmployeModule } from 'src/app/express-courrier/administration/utilisateur/employe/employe.module';
import { StructureSharedModule } from 'src/app/express-courrier/structure/structure/structure-shared/structure-shared.module'
import { StructureModule as StrModule } from 'src/app/express-courrier/structure/structure/structure.module'
import { ModalSidebarAltModule } from 'src/app/helpers/modal-sidebar-alt/modal-sidebar-alt.module';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        StructureRoutingModule,
        EmployeModule,
        StructureSharedModule,
        ModalSidebarAltModule,
        StrModule
    ],
    exports: [],
    declarations: [StructureComponent],
    providers: [],
})
export class StructureModule { }
