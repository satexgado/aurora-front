import { filter, switchMap } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
// import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-ged-structure-ui',
  templateUrl: 'structure-ui.component.html'
})

export class GedStructureComponent implements OnInit {

  structure_loading = true;
  structures: any[];
  parent: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    protected service: StructureService) { }

  ngOnInit() {
    this.route.data
      .subscribe((res: { data: any }) => {
        if(res.data?.structures) {
          this.structures = res.data.structures;
          this.structure_loading = false;
        }
        this.parent = res.data.parent;
      })
  }
}
