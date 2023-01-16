import { Filter } from 'src/app/shared/models/query-options';
import { MailDetailsInboxResolver } from './mail-details/mail-details-inbox.resolver';
import { GestionMailTemplateComponent } from './template/template.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionMailInboxComponent } from './inbox/inbox.component';
import { GestionMailsDetailsComponent } from './mail-details/mail-details.component';
import { GestionMailUiComponent } from './ui/template-ui.component';
import { GestionMailInterneComponent } from './interne/interne.component';
import { MailInterneResolver } from './interne/interne.resolver'
const routes: Routes = [
    {
      path: 'acceuil',
      component: GestionMailUiComponent,
      children: [
        {
          path: 'interne',
          component: GestionMailInterneComponent,
          children: [
            {
              path: ':id',
              resolve: { mail: MailInterneResolver}
            }
          ]
        },
        {
          path: 'important',
          component: GestionMailInterneComponent,
          data: {
            filter: new Filter('important_ins', true, 'eq'),
          },
          children: [
            {
              path: ':id',
              resolve: { mail: MailInterneResolver}
            }
          ]
        },
        {
          path: 'envoye',
          component: GestionMailInterneComponent,
          data: {
            filter: new Filter('envoye_ins', true, 'eq'),
          },
          children: [
            {
              path: ':id',
              resolve: { mail: MailInterneResolver}
            }
          ]
        },
      ]
    },
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'acceuil/interne'
    },
    // { path: '', component: GestionMailTemplateComponent, children: [
    //   {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'acceuil'
    //   },
    //   {
    //     path: 'inbox',
    //     component: GestionMailInboxComponent
    //   },
    //   {
    //     path: 'inbox/:id',
    //     component: GestionMailsDetailsComponent,
    //     resolve: { mail: MailDetailsInboxResolver}
    //   }
    // ]},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [MailDetailsInboxResolver, MailInterneResolver]
})
export class GestionMailRoutingModule {}
