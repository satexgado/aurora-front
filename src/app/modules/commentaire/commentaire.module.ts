import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommentaireComponent } from './commentaire.component';
import { CommentaireDetailsComponent } from './details/commentaire-details.component';
import { CommentaireListComponent } from './list/commentaire-list.component';
import { CommentaireDetailsUiComponent } from './details/ui/commentaire-details-ui.component';
import { CommentaireSectionUiComponent } from './section-ui/commentaire-section-ui.component';

@NgModule({
    declarations: [
        CommentaireComponent,
        CommentaireDetailsComponent,
        CommentaireDetailsUiComponent,
        CommentaireListComponent,
        CommentaireSectionUiComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [
        CommentaireComponent,
        CommentaireDetailsUiComponent,
        CommentaireDetailsComponent,
        CommentaireListComponent,
        CommentaireSectionUiComponent
    ]
})
export class CommentaireModule {

}