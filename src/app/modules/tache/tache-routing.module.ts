import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Filter } from 'src/app/shared/models/query-options';
import { TacheBatchComponent } from './batch/tache-batch.component';
import { TacheCollabComponent } from './collab/tache-collab.component';
import { TacheHomeComponent } from './home/tache-home.component';
import { GestionnaireTacheComponent } from './tache.component';


const routes: Routes = [
  {
    path: '',
    component: TacheHomeComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'mes-taches'},
      {
        path: 'tous', component: GestionnaireTacheComponent,
        data: {
          filters: [
            {or: false, filters: [
              new Filter('parent_insc', 1, 'eq'),
            ]}
          ]
        }
      },
      {
        path: 'mes-taches', component: GestionnaireTacheComponent,
        data: {
          filters: [
            {or: false, filters: [
              new Filter('is_ins', 1, 'eq'),
              new Filter('archived_at', '', 'eq')
            ]}
          ],
          removeAfterArchive: true
        }
      },
      {
        path: 'archive', component: GestionnaireTacheComponent,
        data: {
          filters: [
            {or: false, filters: [
              new Filter('archived_at', '', 'eq', true),
            ]}
          ],
          removeAfterArchive: true
        }
      },
      {
        path: 'collaboration', component: TacheCollabComponent
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class GestionnaireTacheRoutingModule {}
