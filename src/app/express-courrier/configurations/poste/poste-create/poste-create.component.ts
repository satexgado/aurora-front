import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PosteService } from '../poste.service';
import { BaseCreateComponent } from './../../../../shared/base-component/base-create.component';
import { ReplaySubject } from 'rxjs';
import { StructureService } from '../../../structure/structure/structure.service';
import { Structure } from '../../../structure/structure/structure.model';

@Component({
  selector: 'app-poste-create',
  templateUrl: './poste-create.component.html',
  styleUrls: ['./poste-create.component.scss'],
})
export class PosteCreateComponent
  extends BaseCreateComponent
  implements OnInit
{
  public reset$ = new ReplaySubject(1);
  public structure: Structure;
  constructor(
    public posteService: PosteService,
    public structureService: StructureService
  ) {
    super(posteService);
  }

  ngOnInit(): void {
    this.subscriptions['structure'] =
      this.structureService.singleData$.subscribe((structure) => {
        this.structure = structure;
      });
  }

  onCreated(form: FormGroup) {
    this.loading = true;
    this.posteService
      .store({ ...form, structure: this.structure.id })
      .subscribe(() => {
        this.loading = false;
        this.helper.notification.alertSuccess();
        this.reset$.next();
        this.created.next();
      });
  }
}
