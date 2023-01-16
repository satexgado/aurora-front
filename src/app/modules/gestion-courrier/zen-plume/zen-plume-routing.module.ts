import { ZenPlumeMessageComponent } from './message/message.component';
import { ZenPlumeTemplateComponent } from './template/template.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    // { path: '', component: ZenPlumeTemplateComponent, children:[
    //   {path:'', pathMatch: 'full', redirectTo: 'message'},
    //   {
    //     path: 'message',
    //     component: ZenPlumeMessageComponent,
    //     data: {
    //       sidebarComponent: ContactSidebarComponent
    //     },
    //   },
    //   {
    //     path: 'parle',
    //     component: ZenPlumeMessageComponent,
    //     data: {
    //       sidebarComponent: ContactSidebarComponent,
    //       type: '1'
    //     },
    //   },
    //   {
    //     path: 'urgent',
    //     component: ZenPlumeMessageComponent,
    //     data: {
    //       sidebarComponent: UrgenceSidebarComponent
    //     },
    //   },
    //   {
    //     path: 'favoris',
    //     component: ZenPlumeMessageComponent,
    //     data: {
    //       sidebarComponent: FavorisSidebarComponent
    //     },
    //   },
    //   {
    //     path: 'mot',
    //     component: ZenPlumeMessageComponent,
    //     data: {
    //       sidebarComponent: MotSideBarComponent
    //     },
    //   },
    // ]},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class ZenPlumeRoutingModule {}
