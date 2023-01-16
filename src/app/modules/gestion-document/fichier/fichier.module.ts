import { BasicStoreMultipleFileComponent } from './store-fichier/edit.component';
import { CheckPassFichierComponent } from './checkpass/checkpass.component';
import { BloquerFichierComponent } from './bloquer/bloquer.component';
import { ShareFichierComponent } from './share/share.component';
import { RenommerComponent } from './renommer/renommer.component';
import { ZenFichierBaseComponent } from './fichier-base.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreMultipleFileComponent } from './edit/edit.component';
import { InlineEditorModule } from 'src/app/inline-editor/inline-editor.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ZenDossierFichierModule } from '../dossier/dossier.module';

@NgModule({
    declarations: [
        StoreMultipleFileComponent,
        BasicStoreMultipleFileComponent,
        ZenFichierBaseComponent,
        RenommerComponent,
        ShareFichierComponent,
        BloquerFichierComponent,
        CheckPassFichierComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        InlineEditorModule,
        InfiniteScrollModule,
        ZenDossierFichierModule
    ],
    exports: [
      StoreMultipleFileComponent,
      BasicStoreMultipleFileComponent
    ],
    entryComponents: [BasicStoreMultipleFileComponent, CheckPassFichierComponent, BloquerFichierComponent, StoreMultipleFileComponent, RenommerComponent, ShareFichierComponent],
})
export class ZenFichierModule {

}
