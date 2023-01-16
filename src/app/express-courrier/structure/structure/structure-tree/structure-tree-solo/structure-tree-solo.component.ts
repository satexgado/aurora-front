import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/express-courrier/auth/auth.service';
import { StructureSoloComponent } from '../../structure-shared/structure-solo/structure-solo.component';
import { StructureService } from '../../structure.service';

@Component({
  selector: 'app-structure-tree-solo',
  templateUrl: './structure-tree-solo.component.html',
  styleUrls: ['./structure-tree-solo.component.scss'],
})
export class StructureTreeSoloComponent
  extends StructureSoloComponent
  implements OnInit
{
  structureCopy: any;
  displaySousStructure!: boolean;
  constructor(
    public structureService: StructureService,
    public authService: AuthService
  ) {
    super(structureService);
  }

  ngOnInit(): void {
    this.structureCopy = this.structure;
    this.displaySousStructure = !!this.structure.sous_structures;
  }

  // override show() {
  //   this.structureService.show(this.structure.id, true).subscribe();
  // }

  showSousStructures() {
    if (!this.structure.sous_structures) {
      this.getSousStructures(() => {
        this._showSousStructures();
      });
      return;
    }

    this._showSousStructures();
  }

  private _showSousStructures = () => {
    this.structureCopy.sous_structures = this.structure.sous_structures;
    this.displaySousStructure = true;
  };

  hideSousStructures(): void {
    this.displaySousStructure = false;
    this.structureCopy.sous_structures = null;
  }

  getSousStructures(callback: Function): void {

    this.loading = true;
    this.structureService.getSousStructure(this.structure.id).subscribe(() => {
      this.loading = false;
      callback();
    });
  }
}
