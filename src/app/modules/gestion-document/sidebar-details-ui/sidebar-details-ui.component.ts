import { Fichier } from './../../../core/models/gestion-document/fichier.model';
import { IFichier } from 'src/app/core/models/gestion-document/fichier.model';
import { Component, OnDestroy, ComponentFactoryResolver, ViewChild, ViewContainerRef, Type, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { SidebarDetailsDossierUiComponent } from './dossier-ui/sidebar-details-dossier-ui.component';
import { SidebarDetailsFichierUiComponent } from './fichier-ui/sidebar-details-fichier-ui.component';
import { Dossier, IDossier } from 'src/app/core/models/gestion-document/dossier.model';

@Component({
  selector: 'app-sidebar-details-ui',
  templateUrl: './sidebar-details-ui.component.html'
})
export class SidebarDetailsUiComponent implements AfterViewInit, OnDestroy {

  data: IFichier | IDossier;

  @Input() set init(data: IFichier | IDossier) {
    this.data = data;
    if(this.itemViewContainer)
    {
      this.loadComponent();
    }
  }

  @ViewChild('dynamicView', {read: ViewContainerRef}) itemViewContainer: ViewContainerRef;


  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngAfterViewInit() {
    setTimeout(()=>this.loadComponent());
  }

  loadComponent() {
    if(this.data instanceof Fichier) {
      this.loadFichierComponent();
      return;
    }
    this.loadDossierComponent();
  }

  loadDossierComponent()
  {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SidebarDetailsDossierUiComponent);
    this.itemViewContainer.clear();

    const componentRef = this.itemViewContainer.createComponent(componentFactory);
    const instance = componentRef.instance as SidebarDetailsDossierUiComponent;
    if(this.data instanceof Dossier) {
      instance.init = this.data;
    }
  }

  loadFichierComponent()
  {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SidebarDetailsFichierUiComponent);
    this.itemViewContainer.clear();
    const componentRef = this.itemViewContainer.createComponent(componentFactory);
    const instance = componentRef.instance as SidebarDetailsFichierUiComponent;
    if(this.data instanceof Fichier) {
      instance.init = this.data;
    }
  }

  ngOnDestroy()
  {
  }
}
