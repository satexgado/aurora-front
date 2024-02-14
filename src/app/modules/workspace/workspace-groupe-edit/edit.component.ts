import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { BaseEditComponent } from 'src/app/shared/components/edit/base-edit.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators } from '@angular/forms';
import { JsonFormControlEnum } from 'src/app/core/models/json-form/json-form-control';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { GedWorkspaceGroupe, IGedWorkspaceGroupe } from 'src/app/core/models/gestion-document/ged-workspace-groupe.model';
import { GedWorkspaceGroupeFactory } from 'src/app/core/services/gestion-document/ged-workspace-groupe.factory';
import { NgxPicaImageService, NgxPicaService } from '@digitalascetic/ngx-pica';
import { CacheService } from 'src/app/shared/services';
import { StructureService } from 'src/app/express-courrier/structure/structure/structure.service';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { Helper } from 'src/app/helpers/helper/helper';

@Component({
  selector: 'app-workspace-groupe-edit',
  templateUrl: './edit.component.html',
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class EditComponent extends BaseEditComponent  {
  heading = 'nature';
  @Input() item: IGedWorkspaceGroupe = new GedWorkspaceGroupe();
  typeEnum = JsonFormControlEnum;
  @Input() type: 'user' |'coordonnee' = 'user';
  @Input() workspace_id: number = null;


  constructor(
    cdRef:ChangeDetectorRef,
    activeModal: NgbActiveModal,
    public ngxPicaService: NgxPicaService,
    public ngxPicaImageService: NgxPicaImageService,
    public structureService: StructureService,
    public authService: AuthService,
    public helper2: Helper,
    protected cacheService: CacheService)
  {
    super(new GedWorkspaceGroupeFactory(),cdRef, activeModal);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  createFormGroup(item: IGedWorkspaceGroupe) {

  
    let workspace_id = this.workspace_id ? this.workspace_id : item.workspace_id;
    let type = this.type ? this.type : item.type;

    return this.formBuilder.group({
      'workspace_id': [workspace_id, Validators.required],
      'type': [type, Validators.required],
      'libelle': [item.libelle, Validators.required],
      'id': [item.id]
    });
  }
}
