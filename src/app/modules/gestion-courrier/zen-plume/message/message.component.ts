import { Component, OnInit } from '@angular/core';
import { filterGrp } from 'src/app/shared/models/query-options/query-options.model';
import { ViewChild } from '@angular/core';
import { ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AfterViewInit } from '@angular/core';
import { ComponentFactoryResolver } from '@angular/core';
import { ICrCommentaire } from 'src/app/core/models/gestion-courrier/cr-commentaire';

@Component({
  selector: 'app-zen-plume-message-template',
  templateUrl: 'message.component.html'
})

export class ZenPlumeMessageComponent implements  AfterViewInit {
  message:ICrCommentaire = null;
  messageFilterGrp: filterGrp[] = null;
  @ViewChild('dynamicSideBarView', {read: ViewContainerRef}) itemViewContainer: ViewContainerRef;

  constructor(
    protected route: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngAfterViewInit() {
    this.route.data.subscribe(
      (data: { sidebarComponent: any }) => {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(data.sidebarComponent);
        this.itemViewContainer.clear();
        const componentRef = this.itemViewContainer.createComponent(componentFactory);
        const instance = componentRef.instance as any;
        instance.onSetFilter.subscribe(
          (data)=> {
            this.messageFilterGrp = data;
          }
        )
        if(instance.onCreateNewMessage) {
          instance.onCreateNewMessage.subscribe(
            (data)=> {
              this.onSetMessage(data);
            }
          )
        }
      }
    )
  }

  onSetMessage(message: ICrCommentaire) {
    this.message = message;
  }
}
