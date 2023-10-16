import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppInjector } from './helpers/injector/app-injector.service';
import { AuthGuard } from './express-courrier/auth/auth.guard';
import { SharedModule } from './express-courrier/shared/shared.module';
import { SharedModule as SharedModule2 } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { PageBadUrlComponent } from './express-courrier/pages/page-bad-url/page-bad-url.component';
import { SnotifyModule, ToastDefaults, SnotifyService } from 'ng-snotify';
import { TreeviewModule } from 'ngx-treeview';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TemplateWritomeComponent } from './template-writome/template.component';

registerLocaleData(localeFr, 'fr');

const routes: Routes = [
    {
      path: 'config',
      loadChildren: () =>
        import('./modules/propriete-ged/propriete-ged.module').then(
          (module) => module.ProprieteGedModule
        ),
    },
    {
      path: 'workspace',
      loadChildren: () =>
        import('./modules/workspace/workspace-ged.module').then(
          (module) => module.WorkspaceGedModule
        ),
    },
   {
    path: '',
    component: TemplateWritomeComponent
   },
   {
    path: 'document',
    data: {
      topbar: 'document',
      guards: [{
        scope: 'fichier',
        access: 'LECTURE'
      }]
    },
    loadChildren: () =>
      import('./modules/gestion-document/zen-document.module').then(
        (m) => m.ZenDocumentModule
      ),
    },
  // {
  //   path: 'authentification',
  //   loadChildren: () =>
  //     import('./express-courrier/auth/auth.module').then(
  //       (module) => module.AuthModule
  //     ),
  // },
  // {
  //   path: '',
  //   canActivate: [AuthGuard],
  //   canLoad: [AuthGuard],
  //   canActivateChild: [AuthGuard], 
  //   loadChildren: () =>
  //     import('./express-courrier/express-courrier.module').then(
  //       (module) => module.ExpressCourrierModule
  //     ),
  // },
  // {
  //   path: 'bad-url',
  //   component: PageBadUrlComponent,
  // },


  // {
  //   path: '**',
  //   redirectTo: 'authentification',
  // },
];

@NgModule({
  declarations: [AppComponent, TemplateWritomeComponent],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    NgbModule,
    SnotifyModule.forRoot(),
    TreeviewModule.forRoot(),
    HttpClientModule,
    SharedModule,
    SharedModule2
  ],
  providers: [
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(injector: Injector) {
    AppInjector.injector = injector;
  }
}
