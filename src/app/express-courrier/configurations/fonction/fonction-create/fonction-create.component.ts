import { Component, OnInit } from '@angular/core';
import { BaseCreateComponent } from '../../../../shared/base-component/base-create.component';
import { ReplaySubject } from 'rxjs';
import { FonctionService } from '../fonction.service';
import { FormGroup } from '@angular/forms';
import { StructureService } from './../../../structure/structure/structure.service';
import { Structure } from '../../../structure/structure/structure.model';

@Component({
  selector: 'app-fonction-create',
  templateUrl: './fonction-create.component.html',
  styleUrls: ['./fonction-create.component.scss'],
})
export class FonctionCreateComponent
  extends BaseCreateComponent
  implements OnInit
{
  public reset$ = new ReplaySubject(1);
  public structure: Structure;
  constructor(
    public fonctionService: FonctionService,
    public structureService: StructureService
  ) {
    super(fonctionService);
  }

  ngOnInit(): void {
    this.subscriptions['structure'] =
      this.structureService.singleData$.subscribe((structure) => {
        this.structure = structure;
      });
  }

  onCreated(form: FormGroup) {
    this.loading = true;
    this.fonctionService
      .store({ ...form, structure: this.structure.id })
      .subscribe(() => {
        this.loading = false;
        this.helper.notification.alertSuccess();
        this.reset$.next();
        this.created.next();
      });
  }
}
