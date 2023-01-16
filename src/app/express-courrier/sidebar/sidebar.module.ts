import { SidebarCommunicationComponent } from './sidebar-communication/sidebar-communication.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SidebarCourrierComponent } from './sidebar-courrier/sidebar-courrier.component';
import { Sidebar2Component } from './sidebar2/sidebar2.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [],
  declarations: [SidebarCourrierComponent, Sidebar2Component,  SidebarCommunicationComponent],
  providers: [],
})
export class SidebarModule { }
