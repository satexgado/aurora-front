import { ServiceContactUiComponent } from './service-contact-ui/service-contact-ui.component';
import { ServiceDetailsContactComponent } from './service/details/contact-ui/sd-contact-ui.component';
import { ServiceDetailsInformationComponent } from './service/details/information-ui/sd-information-ui.component';
import { ServiceDetailsResolver } from './service/details/service-details.revolver';
import { ServiceDetailsComponent } from './service/details/service-details.component';
import { ContactComponent } from './contact/contact.component';
import { ProtectedGuard } from 'ngx-auth';
import { ConfigTemplateComponent } from './template/template.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceDetailsPermissionComponent } from './service/details/permission-ui/sd-permission-ui.component';
import { ServiceDetailsHierarchieComponent } from './service/details/hierarchie-ui/sd-hierarchie-ui.component';
import { HorlogeComponent } from './horloge/horloge.component';

const routes: Routes = [
  { path: '', redirectTo: 'service', pathMatch: 'full'},
  { path: 'privilege',
  data: {
    breadcrumb: 'Privilege',
  },
    component: ConfigTemplateComponent,children: [
    {path: '',
      loadChildren: () => import('./role-permission/role-permission.module').then(m => m.RolePermissionModule),
    canActivate:[ProtectedGuard]},
    ]
  },
  { path: 'horloge',
  data: {
    breadcrumb: 'Mes Horloges',
  },
    component: ConfigTemplateComponent,children: [
    {path: '',
    component:HorlogeComponent,
    canActivate:[ProtectedGuard]},
    ]
  },
  { path: 'service',
  data: {
    breadcrumb: 'Service et contact',
  },
    component: ConfigTemplateComponent,children: [
      {
        path: '', component: ServiceContactUiComponent, pathMatch:'full',
        canActivate:[ProtectedGuard]
      },
      {
        path: ':id', component: ServiceDetailsComponent,
        resolve: { service: ServiceDetailsResolver},
        children: [
          {path: '', redirectTo: 'details', pathMatch:'full'},
          {path: 'details', component: ServiceDetailsInformationComponent},
          {path: 'contact', component: ServiceDetailsContactComponent},
          {path: 'permission', component: ServiceDetailsPermissionComponent},
          {path: 'hierarchie', component: ServiceDetailsHierarchieComponent}
        ]
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [ServiceDetailsResolver]
})
export class ConfigRoutingModule {}
