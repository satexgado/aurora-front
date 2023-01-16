import { CrReaffectation, ICrReaffectation } from 'src/app/core/models/gestion-courrier/cr-reaffectation';
import { CrCourrierEntrantFactory } from 'src/app/core/services/gestion-courrier/cr-courrier-entrant';
import { Component, OnInit} from '@angular/core';
import { ResourceScrollableHelper } from 'src/app/shared/state';
import { Filter, QueryOptions } from 'src/app/shared/models/query-options';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AffectationEditComponent } from '../../courrier-shared/affectation/affectation.component';
import { switchMap } from 'rxjs/operators';
import { CrCourrierEntrant } from 'src/app/core/models/gestion-courrier/cr-courrier-entrant';

@Component({
  selector: 'app-courrier-entrant-kanban',
  templateUrl: './cek.component.html'
})
export class CourrierEntrantKanbanComponent implements OnInit {
  entrantHelper: ResourceScrollableHelper;
  affectertHelper: ResourceScrollableHelper;
  traitementHelper: ResourceScrollableHelper;
  validationtHelper: ResourceScrollableHelper;

  constructor(
    protected modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
    this.entrantHelper = new ResourceScrollableHelper(
      new CrCourrierEntrantFactory(), new QueryOptions([])
    );
    this.entrantHelper.relations = [
      'cr_courrier.cr_type',
      'cr_courrier.cr_nature',
      'cr_courrier.cr_urgence',
      'cr_coordonnee',
      'inscription'
    ];

    this.entrantHelper.searchCustomFilterGroup = {or: false, filters:[
      new Filter('is_not_affected', true, 'eq'),
    ]}
    // this.entrantHelper.withoutPaginate = true;
    this.entrantHelper.loadData();

    this.affectertHelper = new ResourceScrollableHelper(
      new CrCourrierEntrantFactory(), new QueryOptions([])
    );
    this.affectertHelper.relations = [
      'cr_courrier.cr_type',
      'cr_courrier.cr_nature',
      'cr_courrier.cr_urgence',
      'cr_courrier.cr_reaffected_structure',
      'cr_coordonnee',
      'inscription'
    ];

    this.affectertHelper.searchCustomFilterGroup = {or: false, filters:[
      new Filter('is_affected', true, 'eq'),
    ]}
    // this.entrantHelper.withoutPaginate = true;
    this.affectertHelper.loadData();
  }

  onShowAffectationForm(courrier: CrCourrierEntrant) {
    const modalRef = this.modalService.open(AffectationEditComponent, { size: 'lg', centered: true, backdrop: 'static' });
    const instance = modalRef.componentInstance as AffectationEditComponent;
    instance.isUpdating = false;
    instance.title = 'Affecté à';
    const item = new CrReaffectation();
    item.courrier_id = courrier.courrier_id;
    instance.item = item;

    instance.newItem.pipe(
    ).subscribe(
      (data) => {
        let updatedCourrier = courrier;
        updatedCourrier.courrier.affected_structure=data.structure;
        this.affectertHelper.addItem(updatedCourrier);
        this.entrantHelper.removeItem(courrier.courrier_id);
        // const service = new RREtendueFactory();
        // service.attachAffectation(newItemid, data.relationName+'s', data.relationId).subscribe();
      }
    );
  }
}
