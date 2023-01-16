import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {  Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, distinctUntilChanged, map, startWith } from 'rxjs/operators';

export interface BreadCrumb {
  label: string;
  url: string;
};

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  breadcrumbs$: Observable<any>;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.breadcrumbs$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged(),
      map(event =>  this.buildBreadCrumb(this.activatedRoute.root)),
      startWith(this.buildBreadCrumb(this.activatedRoute.root))
    );
  }

    ngOnInit() {

    }

  buildBreadCrumb(route: ActivatedRoute, url: string = '',
      breadcrumbs: Array<BreadCrumb> = []): Array<BreadCrumb> {
      //If no routeConfig is avalailable we are on the root path
      let label;
      let path;

      if(route.routeConfig)
      {
        path =  route.routeConfig.path ? route.routeConfig.path : '';
        let snapshotdata;
        if(route.snapshot)
        {
          snapshotdata = Object.values(route.snapshot.data).pop();
        }

        if(route.routeConfig.data)
        {
          label = route.routeConfig.data[ 'breadcrumb' ] ? route.routeConfig.data[ 'breadcrumb' ] : false;
        }

        else if( snapshotdata && snapshotdata.id && snapshotdata.libelle)  {
          label = snapshotdata.libelle;
          path = snapshotdata.slug ? snapshotdata.slug : snapshotdata.id;
        }

        else {
          route.params.subscribe((data) =>
          {
            if(data.slug){
              label = data.slug;
              path = data.slug;
            }
            else {
              label = false;
            }
          })
        }
      } else {
        label = 'Vision';
        path = '';
      }

      if(typeof path === 'string' || path instanceof String) {
        if( path.includes(':id') && route.snapshot.params.id ){
          path = path.replace("/:id", '');
        }

        if( path.includes(':slug') && route.snapshot.params.slug){
          path = path.replace("/:slug", '');
        }
      }

      //In the routeConfig the complete path is not available,
      //so we rebuild it each time
      const nextUrl = `${url}${path}/`;
      let newBreadcrumbs;
      if(label){
        const breadcrumb = {
            label: label,
            url: nextUrl
        };
        newBreadcrumbs = [ ...breadcrumbs, breadcrumb ];
      } else {
        newBreadcrumbs = [ ...breadcrumbs ];
      }

      if (route.firstChild) {
          //If we are not on our current path yet,
          //there will be more children to look after, to build our breadcumb
          return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
      }

      return newBreadcrumbs;
  }

  replaceParams(path: string) {
  }
}
