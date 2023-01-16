import { Component, OnInit, Input } from '@angular/core';
import { InformeService } from '../services/informe.service';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css']
})
export class DeleteConfirmationComponent implements OnInit {
  @Input() url:any;
  @Input() del:any;
  @Input() id:any;
  constructor(public informe:InformeService) { }

  ngOnInit() {
    this.del=false;
  }
  delete() {
    this.del=true;
    this.informe.delete(this.url+'/',this.id,this.url);
    this.informe._Subject$.subscribe(()=>{
      this.del=false;          
      this.informe.closeModal('#deleteModal');
    });
    
  }

}
