import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { BaseComponent } from 'src/app/shared/base-component/base.component';
import { StructureService } from '../structure.service';

@Component({
  selector: 'app-structure-organigramme',
  templateUrl: './structure-organigramme.component.html',
  styleUrls: ['./structure-organigramme.component.scss'],
})
export class StructureOrganigrammeComponent
  extends BaseComponent
  implements OnInit
{
  zoom = 100;

  constructor(
    public structureService: StructureService,
    public authService: AuthService
  ) {
    super(structureService);
  }

  ngOnInit(): void {
    this.getData();

    this.subscriptions['organigramme'] =
      this.structureService.organigrammeData$.subscribe((data) => {
        this.data = [...data];
      });
  }

  getData(): void {
    this.loading = true;
    this.structureService
      .getOldestAncestor(this.authService.structuresID[0])
      .subscribe(() => {
        this.loading = false;
      });
  }
}
